import { Message } from '@/types/chat.types';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import React, { useRef, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { spacing } from '@/theme/tokens';
import MessageBubble from './list/MessageBubble';

interface ChatListProps {
  messages: Message[];
}

const ChatList = ({ messages }: ChatListProps) => {
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

  const scrollToBottom = () => {
    if (isAtBottom) {
      setTimeout(() => {
        flashListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <FlashList
      ref={flashListRef}
      onScroll={handleScroll}
      contentContainerStyle={[styles.listContent]}
      scrollEventThrottle={16}
      data={messages}
      renderItem={renderMessages}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={scrollToBottom}
      style={styles.listContent}
    />
  );
};

export default ChatList;

const styles = StyleSheet.create({
  listContent: {
    marginHorizontal: spacing.sm,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: Platform.OS === 'ios' ? 70 : 80,
  },
});
