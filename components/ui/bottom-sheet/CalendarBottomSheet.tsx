import React from 'react';
import { StyleSheet, Text, Alert, Pressable, View, Share } from 'react-native';

import { format, parseISO } from 'date-fns';
import * as Calendar from 'expo-calendar';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import BaseBottomSheet from './BaseBottomSheet';
import BottomSheetOption from './BottomSheetOption';
import { colors, radius, spacing, typography } from '@/theme/tokens';

interface CalendarBottomSheetProps {
  title?: string;
  date?: string;
  time?: string;
  visible: boolean;
  setVisible: (show: boolean) => void;
}

const CalendarBottomSheet = ({
  title,
  date,
  time,
  visible,
  setVisible,
}: CalendarBottomSheetProps) => {
  const formattedDate = format(parseISO(date || ''), 'MMMM do');
  const close = () => setVisible(false);

  const openInCalendarApp = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Calendar permission is needed.');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      const writable =
        calendars.find((c) => c.allowsModifications && c.isPrimary) ||
        calendars.find((c) => c.allowsModifications);

      if (!writable) {
        Alert.alert('Error', 'No writable calendar available.');
        return;
      }

      const eventDate = parseISO(date || '');
      const [hours, minutes] = time?.split(':') || ['12', '00'];

      const startDate = new Date(eventDate);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);

      const res = await Calendar.createEventInCalendarAsync({
        title: title || 'Event',
        startDate,
        endDate,
      });

      if (res.action === 'saved') {
        Alert.alert('Success', 'Event saved.');
        close();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not open calendar.');
    }
  };

  const shareEvent = async () => {
    const message = `${title}\n${formattedDate} at ${time}`;

    try {
      const res = await Share.share({
        message: message,
      });
      console.log(res);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <BaseBottomSheet visible={visible} onClose={close}>
      <Text style={styles.sheetTitle}>{title}</Text>

      <Text style={styles.sheetSubtitle}>
        {formattedDate} at {time}
      </Text>

      <View style={styles.options}>
        <BottomSheetOption
          icon={<MaterialIcons name='open-in-new' size={22} color='#1976D2' />}
          iconBackgroundColor='#E3F2FD'
          title='Add to Calendar'
          subtitle='View and edit in calendar app'
          onPress={openInCalendarApp}
        />
        <BottomSheetOption
          icon={<Feather name='share' size={24} color={colors.warning} />}
          iconBackgroundColor='#FFF3E0'
          title='Share Event'
          subtitle='Share event with other people'
          onPress={shareEvent}
        />
      </View>

      <Pressable style={styles.cancelButton} onPress={close}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </BaseBottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetTitle: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  sheetSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
  },

  options: {
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },

  cancelButton: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
});

export default CalendarBottomSheet;
