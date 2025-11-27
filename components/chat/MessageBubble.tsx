import { Message } from '@/types/chat.types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DynamicComponent from './ComponentRegistry';

interface MessageBubbleProps {
  item: Message;
}

const MessageBubble = ({ item }: MessageBubbleProps) => {
  const { textContent, component, status } = item;
  const isUser = item.role === 'user';

  return (
    <View style={[styles.container, isUser && styles.containerUser]}>
      <View
        style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}
      >
        <Text style={[styles.text, isUser && styles.textUser]}>
          {textContent}
        </Text>
        {component && (
          <DynamicComponent
            type={component.type}
            fields={component.fields}
            isComplete={component.isComplete}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  containerUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: 'gray',
    borderBottomRightRadius: 4,
  },
  bubbleAgent: {
    backgroundColor: 'yellow',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
  },
  textUser: {
    color: 'white',
  },
});

export default MessageBubble;
