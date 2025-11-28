import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

interface CardProps {
  children: React.ReactNode;
  onLongPress?: () => void;
  style?: any;
}

const Card = ({ children, onLongPress, style }: CardProps) => {
  return (
    <Pressable onLongPress={onLongPress} style={[styles.card, style]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: spacing.md,
  },
});

export default React.memo(Card);
