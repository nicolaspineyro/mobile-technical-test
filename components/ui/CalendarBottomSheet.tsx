import {
  StyleSheet,
  Text,
  Alert,
  Modal,
  Pressable,
  View,
  Share,
} from 'react-native';
import * as Calendar from 'expo-calendar';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

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
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={close}
    >
      <Pressable style={styles.modalOverlay} onPress={close}>
        <Pressable
          style={styles.bottomSheet}
          onPress={(e) => e.stopPropagation()}
        >
          <Pressable style={styles.handleBar} onPress={close} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
          </View>
          <Text style={styles.sheetSubtitle}>
            {formattedDate} at {time}
          </Text>

          <View style={styles.options}>
            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={openInCalendarApp}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialIcons name='open-in-new' size={22} color='#1976D2' />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Open in Calendar</Text>
                <Text style={styles.optionSubtitle}>View in calendar app</Text>
              </View>
              <AntDesign name='right' size={18} color={colors.textTertiary} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={shareEvent}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Feather name='share' size={24} color={colors.warning} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Share Event</Text>
                <Text style={styles.optionSubtitle}>Send to contacts</Text>
              </View>
              <AntDesign name='right' size={18} color={colors.textTertiary} />
            </Pressable>
          </View>

          <Pressable style={styles.cancelButton} onPress={close}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
    maxHeight: '70%',
    ...shadows.lg,
  },

  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.cardBorder,
    borderRadius: radius.sm,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  sheetTitle: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    flex: 1,
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

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSecondary,
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
