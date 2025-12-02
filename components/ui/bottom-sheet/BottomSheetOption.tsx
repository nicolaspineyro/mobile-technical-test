import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '@/theme/tokens';
import Pressable from '../button/Pressable';

interface BottomSheetOptionProps {
  icon: React.ReactNode;
  iconBackgroundColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const BottomSheetOption = ({
  icon,
  iconBackgroundColor,
  title,
  subtitle,
  onPress,
}: BottomSheetOptionProps) => {
  return (
    <Pressable style={styles.option} onPress={onPress}>
      <View
        style={[styles.optionIcon, { backgroundColor: iconBackgroundColor }]}
      >
        {icon}
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <AntDesign name='right' size={18} color={colors.textTertiary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  optionPressed: {
    backgroundColor: colors.background,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
    gap: spacing.xs,
  },
  optionTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  optionSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
});

export default React.memo(BottomSheetOption);
