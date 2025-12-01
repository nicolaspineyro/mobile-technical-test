import React, { useState } from 'react';
import { CalendarEventFields } from '@/types/chat.types';
import { Text, StyleSheet, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import CalendarBottomSheet from '@/components/ui/bottom-sheet/CalendarBottomSheet';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/button/Button';
interface CalendarEventProps {
  data: Partial<CalendarEventFields>;
}

const CalendarEvent = ({ data }: CalendarEventProps) => {
  const { title, date, time, status } = data;
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const isConfirmed = status === 'CONFIRMED';

  const statusStyle = status ? statusConfig[status] : statusConfig.PROPOSED;
  const formattedDate = format(parseISO(date || ''), 'MMMM do');

  const handleLongPress = () => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    setShowBottomSheet(true);
  };

  return (
    <>
      <Card
        onLongPress={isConfirmed ? handleLongPress : undefined}
        pressable={isConfirmed}
      >
        <Text style={styles.title}>{title}</Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date: </Text>
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time: </Text>
            <Text style={styles.detailText}>{time}hs</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            {statusStyle.icon}
            <Text style={[styles.badgeText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>
          {status === 'CONFIRMED' && (
            <Button
              variant='text'
              onPress={() => setShowBottomSheet(true)}
              title='Actions'
              size='sm'
            />
          )}
        </View>
      </Card>

      <CalendarBottomSheet
        visible={showBottomSheet}
        setVisible={setShowBottomSheet}
        {...data}
      />
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: typography.xl,
    marginRight: spacing.sm,
  },

  title: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  details: {
    marginBottom: spacing.lg,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  detailLabel: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textSecondary,
  },

  detailText: {
    fontSize: typography.base,
    fontWeight: typography.regular,
    color: colors.textSecondary,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  badgeText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const statusConfig = {
  PROPOSED: {
    label: 'Proposed',
    color: colors.warning,
    bg: '#FFF3E0',
    icon: (
      <MaterialIcons
        name='pending'
        color={colors.warning}
        size={typography.base}
      />
    ),
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: colors.success,
    bg: '#E8F5E9',
    icon: (
      <FontAwesome
        name='check-circle'
        size={typography.base}
        color={colors.success}
      />
    ),
  },
  CANCELED: {
    label: 'Cancelled',
    color: colors.error,
    bg: '#FFEBEE',
    icon: (
      <Entypo
        name='circle-with-cross'
        size={typography.base}
        color={colors.error}
      />
    ),
  },
};

export default CalendarEvent;
