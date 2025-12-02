import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useChat } from '@/hooks/useChat';
import Controls from '@/components/chat/Controls';
import ChatList from '@/components/chat/ChatList';
import { colors } from '@/theme/tokens';
import ChatHeader from '@/components/chat/ChatHeader';

export default function ChatScreen() {
  const {
    messages,
    isConnected,
    isLoading,
    error,
    reconnect,
    disconnect,
    reset,
  } = useChat();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container]}>
        <StatusBar barStyle='dark-content' />
        <ChatHeader isConnected={isConnected} error={error} />
        <ChatList messages={messages} isLoading={isLoading} />
        <Controls
          isConnected={isConnected}
          reconnect={reconnect}
          reset={reset}
          disconnect={disconnect}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
