import { useCallback, useReducer } from 'react';
import {
  chatReducer as reducer,
  initialChatState as initialState,
} from '@/reducers/chatReducer';
import { useSSEStream } from './useSSEStream';
import { SSEEvent } from '@/types/chat.types';

const DEFAULT_SSE_URL =
  'https://api-dev.withallo.com/v1/demo/interview/conversation';

const SSE_URL = process.env.EXPO_PUBLIC_SSE_URL || DEFAULT_SSE_URL;

export function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleEvent = useCallback((event: SSEEvent) => {
    dispatch({
      type: 'EVENT_RECEIVED',
      event,
    });
  }, []);

  const handleError = useCallback((error: Error) => {
    dispatch({ type: 'ERROR_OCCURRED', error: error.message });
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    dispatch({
      type: 'CONNECTION_CHANGED',
      connected,
    });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const { reconnect, disconnect } = useSSEStream({
    url: SSE_URL,
    onEvent: handleEvent,
    onError: handleError,
    onConnectionChange: handleConnectionChange,
  });

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    error: state.error,
    reconnect,
    disconnect,
    reset,
  };
}
