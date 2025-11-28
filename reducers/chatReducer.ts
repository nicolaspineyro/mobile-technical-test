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

function validateMessageExists(
  state: ChatState,
  messageId: string,
  eventType: string,
  event: SSEEvent
): boolean {
  const messageExists = state.messages.some((m) => m.id === messageId);
  if (!messageExists) {
    console.error(
      `[ChatReducer] ${eventType} received for unknown message: ${messageId}`,
      { event }
    );
  }
  return messageExists;
}

function buildTextFromChunks(chunks: Record<number, string>): string {
  const sortedIndices = Object.keys(chunks)
    .map(Number)
    .sort((a, b) => a - b);

  return sortedIndices.map((index) => chunks[index]).join('');
}

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
            textChunks: {},
            timeStamp: Date.now(),
          };

          return {
            ...state,
            messages: [...state.messages, newMessage],
          };
        }
        case 'text_chunk': {
          if (
            !validateMessageExists(state, event.messageId, 'text_chunk', event)
          ) {
            return state;
          }

          return {
            ...state,
            messages: state.messages.map((message) => {
              if (message.id !== event.messageId) return message;

              const updatedChunks = {
                ...(message.textChunks ?? {}),
                [event.index]: event.chunk,
              };

              const textContent = buildTextFromChunks(updatedChunks);

              return {
                ...message,
                textChunks: updatedChunks,
                textContent,
              };
            }),
          };
        }

        case 'message_end': {
          if (
            !validateMessageExists(state, event.messageId, 'message_end', event)
          ) {
            return state;
          }

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
          if (
            !validateMessageExists(
              state,
              event.messageId,
              'component_start',
              event
            )
          ) {
            return state;
          }

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
          if (
            !validateMessageExists(
              state,
              event.messageId,
              'component_field',
              event
            )
          ) {
            return state;
          }

          return {
            ...state,
            messages: state.messages.map((message) => {
              if (message.id !== event.messageId) return message;

              if (!message.component?.type) {
                console.error(
                  `[ChatReducer] component_field received but message has no component: ${event.messageId}`,
                  { event }
                );
                return message;
              }

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
