export type SSEEventType =
  | 'message_start'
  | 'text_chunk'
  | 'message_end'
  | 'component_start'
  | 'component_field'
  | 'component_end';

export type MessageRole = 'user' | 'agent';

export type ComponentType = 'contact_badge' | 'calendar_event';

export type SSEEvent =
  | MessageStartEvent
  | TextChunkEvent
  | MessageEndEvent
  | ComponentStartEvent
  | ComponentFieldEvent
  | ComponentEndEvent;

export interface MessageStartEvent {
  event: 'message_start';
  messageId: string;
  role: MessageRole;
}

export interface TextChunkEvent {
  event: 'text_chunk';
  messageId: string;
  chunk: string;
  index: number;
}

export interface MessageEndEvent {
  event: 'message_end';
  messageId: string;
}

export interface ComponentStartEvent {
  event: 'event_start';
  messageId: string;
  componentType: ComponentType;
}

export interface ComponentFieldEvent {
  event: 'component_field';
  messageId: string;
  field: string;
  value: string;
}

export interface ComponentEndEvent {
  event: 'event_end';
  messageId: string;
}
