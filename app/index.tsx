import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { Message } from '@/types/chat.types';
import { hapticImpact } from '@/utils/haptics';

import { useChat } from '@/hooks/useChat';

import MessageBubble from '@/components/chat/MessageBubble';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { ChatHeader } from '@/components/chat/ChatHeader';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { messages, isConnected, error, reconnect, reset, disconnect } =
    useChat();
  const flashListRef = useRef<FlashListRef<Message>>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const renderMessages = ({ item }: { item: Message }) => {
    return <MessageBubble item={item} />;
  };

  const handleScroll = (e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;

    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);

    setIsAtBottom(distanceFromBottom < 50);
  };

  useEffect(() => {
    if (messages.length > 0 && isAtBottom) {
      setTimeout(() => {
        flashListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isAtBottom, messages.length]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle='dark-content' />
      <ChatHeader isConnected={isConnected} error={error} />

      <FlashList
        ref={flashListRef}
        onScroll={handleScroll}
        contentContainerStyle={styles.listContent}
        scrollEventThrottle={16}
        data={messages}
        renderItem={renderMessages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.listContent}
      />

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
        <Pressable
          style={({ pressed }) => [
            styles.buttonSecondary,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            disconnect();
          }}
          onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
        >
          <Text style={styles.buttonText}>Stop Stream</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing['3xl'],
  },
  controls: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    borderBottomWidth: 0,
    borderRadius: radius.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  buttonSecondary: {
    backgroundColor: colors.agentBubble,
    color: 'red',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  buttonSecondaryText: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },

  buttonPressed: {
    opacity: 0.8,
  },
});
