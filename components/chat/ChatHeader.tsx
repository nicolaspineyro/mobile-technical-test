import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import TMFCLogo from '../icons/TMFCLogo';
import { colors, spacing, typography } from '@/theme/tokens';

interface ChatHeaderProps {
  isConnected: boolean;
  error: string | null;
}

export function ChatHeader({ isConnected, error }: ChatHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      tint='light'
      style={[styles.container, { paddingTop: insets.top }]}
      experimentalBlurMethod={
        Platform.OS === 'android' ? 'dimezisBlurView' : 'none'
      }
    >
      <View style={styles.content}>
        <TMFCLogo fill={'black'} width={250} height={30} />
        <View
          style={[
            styles.dot,
            {
              backgroundColor: isConnected
                ? colors.success
                : colors.textTertiary,
            },
          ]}
        />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
