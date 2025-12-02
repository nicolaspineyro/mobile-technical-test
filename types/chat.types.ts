export type SSEEventType =
  | 'message_start'
  | 'text_chunk'
  | 'message_end'
  | 'component_start'
  | 'component_field'
  | 'component_end';

export type MessageRole = 'user' | 'agent';

export type ChatComponentType = 'contact_badge' | 'calendar_event';

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
  event: 'component_start';
  messageId: string;
  componentType: ChatComponentType;
}

export interface ComponentFieldEvent {
  event: 'component_field';
  messageId: string;
  field: string;
  value: string;
}

export interface ComponentEndEvent {
  event: 'component_end';
  messageId: string;
}

export interface ContactBadgeFields {
  name: string;
  email: string;
  company: string;
  profilePicture: string;
}

export interface CalendarEventFields {
  title: string;
  date: string;
  time: string;
  status: 'PROPOSED' | 'CONFIRMED' | 'CANCELED';
}
export interface ComponentData {
  type: ChatComponentType;
  fields: Partial<ContactBadgeFields | CalendarEventFields>;
  fieldsReceived: string[];
  isComplete: boolean;
}

export type MessageStatus = 'building' | 'complete';
export interface Message {
  id: string;
  role: MessageRole;
  status: MessageStatus;
  textContent: string;
  component?: ComponentData;
  timeStamp: number;
}

export interface ChatState {
  messages: Message[];
  isConnected: boolean;
  error: string | null;
}
