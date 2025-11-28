import { SSEEvent, SSEEventType } from '@/types/chat.types';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import EventSource from 'react-native-sse';

interface useSSEStreamProps {
  url: string;
  onEvent: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  onConnectionChange?: (connected: boolean) => void;
  autoReconnect?: boolean;
}

export function useSSEStream({
  url,
  onEvent,
  onError,
  onConnectionChange,
  autoReconnect = false,
}: useSSEStreamProps) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const callbacksRef = useRef({ onEvent, onError, onConnectionChange });

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      try {
        eventSourceRef.current.removeAllEventListeners();
        eventSourceRef.current.close();
      } catch (error) {
        console.error('Error disconnecting SSE:', error);
      }
      eventSourceRef.current = null;
    }
    callbacksRef.current.onConnectionChange?.(false);
  }, []);

  const connect = useCallback(() => {
    disconnect();

    console.log('connecting to sse...');

    const eventSource = new EventSource<SSEEventType>(url, {
      headers: {
        Accept: 'text/event-stream',
      },
      pollingInterval: autoReconnect ? 5000 : 0,
    });

    const eventTypes: SSEEventType[] = [
      'message_start',
      'text_chunk',
      'message_end',
      'component_start',
      'component_field',
      'component_end',
    ];

    const handleOpen = () => {
      console.log('connection established');
      callbacksRef.current.onConnectionChange?.(true);
    };

    const handleError = (error: any) => {
      console.error('SSE connection error', error);
      callbacksRef.current.onError?.(
        new Error(error.type || 'SSE connection error')
      );
      callbacksRef.current.onConnectionChange?.(false);
    };

    eventTypes.forEach((eventType) => {
      eventSource.addEventListener(eventType, (event: any) => {
        try {
          const data = JSON.parse(event.data) as SSEEvent;
          callbacksRef.current.onEvent?.(data);
        } catch (error) {
          console.error('failed to get event', error);
        }
      });
    });

    eventSource.addEventListener('open', handleOpen);
    eventSource.addEventListener('error', handleError);

    eventSourceRef.current = eventSource;
  }, [url, autoReconnect, disconnect]);

  useEffect(() => {
    callbacksRef.current = { onEvent, onError, onConnectionChange };
  }, [onEvent, onError, onConnectionChange]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('app should reconnect again in prod...');
        // connect();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('app in background close sse...');
        disconnect();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [connect, disconnect]);

  return { reconnect: connect, disconnect };
}
