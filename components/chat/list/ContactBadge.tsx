import React from 'react';
import { ContactBadgeFields } from '@/types/chat.types';
import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius, spacing, typography } from '@/theme/tokens';

interface ContactBadgeProps {
  data: Partial<ContactBadgeFields>;
}

const ContactBadge = ({ data }: ContactBadgeProps) => {
  const { name, email, company, profilePicture } = data;
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profilePicture }}
        style={styles.avatar}
        contentFit='cover'
        transition={200}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.company}>{company}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: spacing.md,
    gap: spacing.lg,
  },

  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSecondary,
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  email: {
    fontSize: typography.sm,
    fontWeight: typography.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  company: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.textTertiary,
  },
});

export default ContactBadge;
