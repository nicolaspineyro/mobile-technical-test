import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import { useChat } from '@/hooks/useChat';

import { ChatHeader } from '@/components/chat/ChatHeader';
import Controls from '@/components/chat/Controls';
import ChatList from '@/components/chat/ChatList';
import { colors } from '@/theme/tokens';
import DemoEmptyState from '@/components/ui/DemoEmptyState';

export default function ChatScreen() {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Medium': require('../assets/fonts/PlayfairDisplay-Medium.ttf'),
  });

  const { messages, isConnected, error, reconnect, disconnect, reset } =
    useChat();
  const [showEmptyState, setShowEmptyState] = useState(true);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container]}>
        <StatusBar barStyle='dark-content' />
        {showEmptyState ? (
          <DemoEmptyState setShowEmptyState={setShowEmptyState} />
        ) : (
          <>
            <ChatHeader isConnected={isConnected} error={error} />
            <ChatList messages={messages} />
            <Controls
              reconnect={reconnect}
              reset={reset}
              disconnect={disconnect}
            />
          </>
        )}
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
