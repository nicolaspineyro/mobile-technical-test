import React from 'react';
import { CalendarEventFields } from '@/types/chat.types';
import { Text, StyleSheet, View } from 'react-native';

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

      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.statusText, { color: statusStyle.color }]}>
          {statusStyle.label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#212529',
    flex: 1,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#495057',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default CalendarEvent;
