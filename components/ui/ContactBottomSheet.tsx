import { StyleSheet, Text, Alert, Modal, Pressable, View } from 'react-native';
import React from 'react';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';
import { Image } from 'expo-image';
import * as Contacts from 'expo-contacts';

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
      ? [
          {
            email: email,
            isPrimary: true,
            label: 'work',
          },
        ]
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
          <View style={styles.handleBar} />

          <View style={styles.sheetHeader}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.sheetAvatar}
              contentFit='cover'
            />
            <View style={styles.sheetInfo}>
              <Text style={styles.sheetTitle}>{name}</Text>
              <Text style={styles.sheetSubtitle}>{email}</Text>
              <Text style={styles.sheetSubtitle}>{company}</Text>
            </View>
          </View>

          <View style={styles.options}>
            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={openContactForm}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialIcons name='open-in-new' size={22} color='#1976D2' />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Open in Contacts</Text>
                <Text style={styles.optionSubtitle}>
                  View and edit in contacts app
                </Text>
              </View>
              <AntDesign name='right' size={18} color='#999' />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={shareContact}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Feather name='share-2' size={22} color='#F57C00' />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Share Contact</Text>
                <Text style={styles.optionSubtitle}>Send to others</Text>
              </View>
              <AntDesign name='right' size={18} color='#999' />
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
    gap: 12,
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  sheetTitle: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },

  sheetSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
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

  sheetAvatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
  },

  sheetInfo: {
    flex: 1,
  },
});

export default ContactBottomSheet;
