import React from 'react';
import { StyleSheet, Text, Pressable, View, Alert } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { Image } from 'expo-image';
import * as Contacts from 'expo-contacts';
import BaseBottomSheet from '@/components/ui/bottom-sheet/BaseBottomSheet';
import BottomSheetOption from '@/components/ui/bottom-sheet/BottomSheetOption';
import * as Linking from 'expo-linking';

interface ContactBottomSheetProps {
  name?: string;
  email?: string;
  company?: string;
  profilePicture?: string;
  visible: boolean;
  setVisible: (show: boolean) => void;
}

const ContactBottomSheet = ({
  name,
  email,
  company,
  profilePicture,
  visible,
  setVisible,
}: ContactBottomSheetProps) => {
  const close = () => setVisible(false);

  const contact: Contacts.Contact = {
    [Contacts.Fields.Name]: name || '',
    [Contacts.Fields.FirstName]: name?.split(' ')[0] || '',
    [Contacts.Fields.LastName]: name?.split(' ').slice(1).join(' ') || '',
    [Contacts.Fields.Company]: company || '',
    [Contacts.Fields.ContactType]: 'person',
    [Contacts.Fields.Emails]: email
      ? [{ email, isPrimary: true, label: 'work' }]
      : [],
  };

  const openContactForm = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant contacts permissions to add contacts.'
        );
        return;
      }

      await Contacts.presentFormAsync(null, contact, {
        isNew: true,
        allowsEditing: true,
        allowsActions: true,
      });
    } catch (error) {
      console.error('Error opening contact form:', error);
      Alert.alert('Error', 'Failed to open contact form.');
    }
  };

  const shareContact = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant contacts permissions.'
        );
        return;
      }

      const contactId = await Contacts.addContactAsync(contact);

      if (contactId) {
        await Contacts.shareContactAsync(
          contactId,
          `Check out ${name}'s contact!`,
          {}
        );

        await Contacts.removeContactAsync(contactId);
      }
    } catch (error) {
      console.error('Error sharing contact:', error);
      Alert.alert('Error', 'Failed to share contact.');
    }
  };

  const handleEmailPress = async () => {
    const url = `mailto:${email}`;
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert(
        'Error',
        'No email client found, if this is an emulator please try with a real device.'
      );
    }
  };

  return (
    <BaseBottomSheet visible={visible} onClose={close}>
      <View style={styles.header}>
        <Image
          source={{ uri: profilePicture }}
          style={styles.avatar}
          contentFit='cover'
        />
        <View style={styles.info}>
          <Text style={styles.title}>{name}</Text>
          <Pressable onPress={handleEmailPress}>
            <Text style={styles.email}>{email}</Text>
          </Pressable>
          <Text style={styles.subtitle}>{company}</Text>
        </View>
      </View>

      <View style={styles.options}>
        <BottomSheetOption
          icon={<MaterialIcons name='open-in-new' size={22} color='#1976D2' />}
          iconBackgroundColor='#E3F2FD'
          title='Add to Contacts'
          subtitle='View and edit in contacts app'
          onPress={openContactForm}
        />
        <BottomSheetOption
          icon={<Feather name='share' size={24} color={colors.warning} />}
          iconBackgroundColor='#FFF3E0'
          title='Share Contact'
          subtitle='Send to others'
          onPress={shareContact}
        />
      </View>

      <Pressable style={styles.cancelButton} onPress={close}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </BaseBottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  email: {
    fontSize: typography.sm,
    fontWeight: typography.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textDecorationLine: 'underline',
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

export default ContactBottomSheet;
