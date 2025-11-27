import {
  CalendarEventFields,
  ChatComponentType,
  ContactBadgeFields,
} from '@/types/chat.types';
import React from 'react';
import ContactBadge from './ContactBadge';
import CalendarEvent from './CalendarEvent';
import Skeleton from './Skeleton';

interface DynamicComponentProps {
  type: ChatComponentType;
  fields: Partial<ContactBadgeFields | CalendarEventFields>;
  isComplete: boolean;
}

const ComponentRegistry = {
  contact_badge: ContactBadge,
  calendar_event: CalendarEvent,
};

const DynamicComponent = ({
  type,
  fields,
  isComplete,
}: DynamicComponentProps) => {
  if (!isComplete) {
    return <Skeleton />;
  }

  const Component = ComponentRegistry[type];

  return <Component data={fields} />;
};

export default DynamicComponent;
