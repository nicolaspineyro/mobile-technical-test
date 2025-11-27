import type { ChatComponentType } from '@/types/chat.types';

const REQUIRED_FIELDS: Record<ChatComponentType, string[]> = {
  contact_badge: ['name', 'email', 'company', 'profilePicture'],
  calendar_event: ['title', 'date', 'time', 'status'],
};

export function isComponentComplete(
  componentType: ChatComponentType | undefined,
  fieldsReceived: string[]
) {
  if (!componentType) return false;

  const required = REQUIRED_FIELDS[componentType];
  return required.every((field) => fieldsReceived.includes(field));
}
