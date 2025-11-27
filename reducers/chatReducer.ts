import { ChatState, Message, SSEEvent } from '@/types/chat.types';
import { isComponentComplete } from '@/utils/chatComponent.helper';

export type ChatAction =
  | { type: 'EVENT_RECEIVED'; event: SSEEvent }
  | { type: 'CONNECTION_CHANGED'; connected: boolean }
  | { type: 'ERROR_OCCURRED'; error: string }
  | { type: 'RESET' };

export const initialChatState: ChatState = {
  messages: [],
  isConnected: false,
  error: null,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'EVENT_RECEIVED': {
      const event = action.event;
      switch (event.event) {
        case 'message_start': {
          const newMessage: Message = {
            id: event.messageId,
            role: event.role,
            status: 'building',
            textContent: '',
            timeStamp: Date.now(),
          };

          return {
            ...state,
            messages: [...state.messages, newMessage],
          };
        }
        case 'text_chunk': {
          return {
            ...state,
            messages: state.messages.map((message) => {
              if (message.id !== event.messageId) return message;
              return {
                ...message,
                textContent: message.textContent + event.chunk,
              };
            }),
          };
        }

        case 'message_end': {
          return {
            ...state,
            messages: state.messages.map((message) => {
              if (message.id !== event.messageId) return message;
              return {
                ...message,
                status: 'complete',
              };
            }),
          };
        }

        case 'component_start': {
          return {
            ...state,
            messages: state.messages.map((message) => {
              if (message.id !== event.messageId) return message;

              return {
                ...message,
                component: {
                  type: event.componentType,
                  fields: {},
                  fieldsReceived: [],
                  isComplete: false,
                },
              };
            }),
          };
        }

        case 'component_field': {
          return {
            ...state,
            messages: state.messages.map((message) => {
              if (message.id !== event.messageId) return message;

              if (!message.component?.type) return message;

              const updatedFieldsReceived = [
                ...(message.component?.fieldsReceived ?? []),
                event.field,
              ];

              const updatedFields = {
                ...message.component?.fields,
                [event.field]: event.value,
              };

              const isComplete = isComponentComplete(
                message.component?.type,
                updatedFieldsReceived
              );

              return {
                ...message,
                component: {
                  ...message.component,
                  fields: updatedFields,
                  fieldsReceived: updatedFieldsReceived,
                  isComplete,
                },
              };
            }),
          };
        }

        case 'component_end': {
          return state;
        }

        default:
          return state;
      }
    }

    case 'CONNECTION_CHANGED': {
      return {
        ...state,
        isConnected: action.connected,
        error: action.connected ? null : state.error,
      };
    }

    case 'ERROR_OCCURRED': {
      return {
        ...state,
        error: action.error,
        isConnected: false,
      };
    }

    case 'RESET': {
      return initialChatState;
    }

    default:
      return state;
  }
}
