import React from 'react';
import { CalendarEventFields } from '@/types/chat.types';
import { Text, StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

interface CalendarEventProps {
  data: Partial<CalendarEventFields>;
}

const statusConfig = {
  PROPOSED: { label: 'Proposed', color: '#FD7E14', bg: '#FFF3E0' },
  CONFIRMED: { label: 'Confirmed', color: '#28A745', bg: '#E8F5E9' },
  CANCELED: { label: 'Cancelled', color: '#DC3545', bg: '#FFEBEE' },
};

const CalendarEvent = ({ data }: CalendarEventProps) => {
  const { title, date, time, status } = data;

  const statusStyle = status ? statusConfig[status] : statusConfig.PROPOSED;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>📅</Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🗓</Text>
          <Text style={styles.detailText}>{date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailText}>{time}</Text>
        </View>
      </View>

      <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.badgeText, { color: statusStyle.color }]}>
          {statusStyle.label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: spacing.md,
    ...shadows.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  icon: {
    fontSize: 22,
    marginRight: spacing.sm,
  },

  title: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    flex: 1,
  },

  details: {
    marginBottom: spacing.lg,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  detailIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
    width: 20,
  },

  detailText: {
    fontSize: typography.base,
    fontWeight: typography.regular,
    color: colors.textSecondary,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  badgeText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
  },
});

export default CalendarEvent;
