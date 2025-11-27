import {
  CalendarEventFields,
  ChatComponentType,
  ContactBadgeFields,
} from '@/types/chat.types';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ContactBadge from './ContactBadge';
import CalendarEvent from './CalendarEvent';

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
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar} />
        <Text style={styles.loadingText}>Loading {type}...</Text>
      </View>
    );
  }

  const Component = ComponentRegistry[type];

  return <Component data={fields} />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  loadingBar: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#ADB5BD',
    fontStyle: 'italic',
  },
});

export default DynamicComponent;
