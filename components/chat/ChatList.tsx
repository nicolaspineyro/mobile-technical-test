import React, { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList, FlashListRef } from '@shopify/flash-list';

import { Message } from '@/types/chat.types';
import { spacing } from '@/theme/tokens';
import MessageBubble from './list/MessageBubble';

interface ChatListProps {
  messages: Message[];
}

export const HEADER_HEIGHT = 70;
export const CONTROLS_HEIGHT = Platform.OS === 'android' ? 150 : 100;

const ChatList = ({ messages }: ChatListProps) => {
  const insets = useSafeAreaInsets();
  const flashListRef = useRef<FlashListRef<Message>>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const renderMessages = useCallback(({ item }: { item: Message }) => {
    return <MessageBubble item={item} />;
  }, []);
  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleScroll = (e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;

    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);

    const closeToBottom = distanceFromBottom < 50;

    if (closeToBottom !== isAtBottom) {
      setIsAtBottom(closeToBottom);
    }
  };

  const scrollToBottom = () => {
    if (isAtBottom) {
      requestAnimationFrame(() => {
        flashListRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  return (
    <FlashList
      ref={flashListRef}
      onScroll={handleScroll}
      contentContainerStyle={{
        marginHorizontal: spacing.md,
        paddingTop: HEADER_HEIGHT + insets.top,
        paddingBottom: CONTROLS_HEIGHT + insets.bottom,
      }}
      scrollEventThrottle={20}
      data={messages}
      renderItem={renderMessages}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={true}
      onContentSizeChange={scrollToBottom}
    />
  );
};

export default ChatList;
