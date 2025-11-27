import React from 'react';
import { ContactBadgeFields } from '@/types/chat.types';
import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

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
      <View>
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
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DEE2E6',
  },
  info: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: '#868E96',
  },
});

export default ContactBadge;
