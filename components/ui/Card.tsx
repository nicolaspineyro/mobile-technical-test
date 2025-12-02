import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import Pressable from './button/Pressable';
import { ImpactFeedbackStyle } from 'expo-haptics';

interface CardProps {
  children: React.ReactNode;
  onLongPress?: () => void;
  pressable?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const Card = ({
  children,
  onLongPress,
  style,
  disabled,
  pressable = false,
}: CardProps) => {
  if (!pressable) {
    return <View style={[styles.card, style]}>{children}</View>;
  }
  return (
    <Pressable
      onLongPress={onLongPress}
      style={[styles.card, style]}
      hapticStyle={ImpactFeedbackStyle.Light}
      animationDuration={300}
      scale={0.98}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: spacing.md,
  },
});

export default React.memo(Card);
