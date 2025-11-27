import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { Message } from '@/types/chat.types';
import { hapticImpact } from '@/utils/haptics';

import { useChat } from '@/hooks/useChat';

import MessageBubble from '@/components/chat/MessageBubble';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { messages, isConnected, error, reconnect, reset } = useChat();
  const flashListRef = useRef<FlashListRef<Message>>(null);

  const renderMessages = ({ item }: { item: Message }) => {
    return <MessageBubble item={item} />;
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flashListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.content}>
        <FlashList
          ref={flashListRef}
          contentContainerStyle={styles.listContent}
          data={messages}
          renderItem={renderMessages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={[styles.controls, { paddingBottom: insets.bottom }]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            reset();
            reconnect();
          }}
          onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
        >
          <Text style={styles.buttonText}>Start Stream</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  content: {
    width: '100%',
    flex: 1,
  },
  controls: {
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#e0e0e0',
    borderRadius: 16,
  },
  button: {
    backgroundColor: '#FFE016',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonPressed: {
    transform: [{ translateY: 1 }],
    opacity: 0.8,
  },
  buttonText: {
    color: '#002C2A',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 20,
  },
});
