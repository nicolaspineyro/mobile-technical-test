import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Card from './Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DemoEmptyStateProps {
  setShowEmptyState: (show: boolean) => void;
}

const DemoEmptyState = ({ setShowEmptyState }: DemoEmptyStateProps) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.text}>Hello 👋</Text>
      <Text style={styles.text}>Welcome to TMFC technical test!</Text>
      <Text style={styles.text}>Some things to have in mind:</Text>
      <View style={[styles.buttons]}>
        <Card style={styles.card}>
          <Pressable style={styles.buttonPrimary}>
            <AntDesign name='play-circle' size={22} color='black' />
          </Pressable>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.cardText}>Play Button</Text>
            <Text style={styles.cardText}>
              Will connect with the stream and will start filling the screen
              with messages. You can press it again to reconnect or start fresh.
            </Text>
          </View>
        </Card>
        <Card style={styles.card}>
          <Pressable style={styles.buttonSecondary}>
            <FontAwesome5 name='stop-circle' size={22} color='black' />
          </Pressable>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.cardText}>Stop Button</Text>
            <Text style={styles.cardText}>
              Will end the connection with the stream and reset the state
              (removing the messages).
            </Text>
          </View>
        </Card>
        <Card style={styles.card}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: colors.success,
              },
            ]}
          />
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.cardText}>Connection Indicator</Text>
            <Text style={styles.cardText}>
              Inside the header, it will indicate the state of the connection.
              Green for connected, gray for disconnected.
            </Text>
          </View>
        </Card>
        <Text style={styles.text}>Are you ready?</Text>
        <Pressable
          style={styles.start}
          onPress={() => setShowEmptyState(false)}
        >
          <Text style={styles.startText}>Start Demo</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.sm,
  },
  text: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: typography['2xl'],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  buttons: {
    gap: spacing.sm,
  },

  buttonPrimary: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: radius.full,
  },

  buttonSecondary: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    padding: spacing.sm,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
    padding: spacing.lg,
    width: '90%',
    alignSelf: 'center',
    borderRadius: radius.lg,
  },

  cardText: {
    fontWeight: typography.medium,
    fontSize: typography.sm,
    marginBottom: spacing.sm,
  },
  start: {
    backgroundColor: colors.userBubble,
    padding: spacing.md,
    alignSelf: 'center',
    borderRadius: radius.lg,
  },

  startText: {
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.background,
    fontSize: typography.xl,
  },

  dot: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
  },
});

export default DemoEmptyState;
