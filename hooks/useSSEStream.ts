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

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.removeAllEventListeners();
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  const connect = useCallback(() => {
    disconnect();

    console.log('connecting to sse...');

    const eventSource = new EventSource<SSEEventType>(url, {
      headers: {
        Accept: 'text/event-stream',
      },
      pollingInterval: autoReconnect ? 5000 : 0,
    });

    eventSource.addEventListener('open', () => {
      console.log('connection established');
      onConnectionChange?.(true);
    });

    const eventTypes: SSEEventType[] = [
      'message_start',
      'text_chunk',
      'message_end',
      'component_start',
      'component_field',
      'component_end',
    ];

    eventTypes.forEach((eventType) => {
      eventSource.addEventListener(eventType, (event: any) => {
        try {
          const data = event.data as SSEEvent;
          onEvent?.(data);
        } catch (error) {
          console.error('failed to get event', error);
        }
      });
    });

    eventSource.addEventListener('error', (error) => {
      console.error('SSE connection error', error);
      onError?.(new Error(error.type || 'SSE connection error'));
      onConnectionChange?.(false);
    });

    eventSourceRef.current = eventSource;
  }, [autoReconnect, disconnect, onConnectionChange, onError, onEvent, url]);

  useEffect(() => {
    connect();

    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('app active again connecting...');
        connect();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('app in background close sse...');
        disconnect();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [connect, disconnect]);

  return { reconnect: connect };
}
