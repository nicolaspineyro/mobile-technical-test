import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { hapticImpact } from '@/utils/haptics';
import CopyButton from '@/components/ui/CopyButton';
import ActionButton from '@/components/chat/list/ActionButton';
import Card from '@/components/ui/Card';
import ContactBottomSheet from '@/components/ui/bottom-sheet/ContactBottomSheet';
import { ContactBadgeFields } from '@/types/chat.types';

interface ContactBadgeProps {
  data: Partial<ContactBadgeFields>;
}

const ContactBadge = ({ data }: ContactBadgeProps) => {
  const { name, email, company, profilePicture } = data;
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const handleLongPress = () => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    setShowBottomSheet(true);
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
    <>
      <Card onLongPress={handleLongPress} style={styles.container}>
        <Image
          source={{ uri: profilePicture }}
          style={styles.avatar}
          contentFit='cover'
          transition={200}
        />
        <View style={styles.textContent}>
          <Text style={styles.name}>{name}</Text>

          <View style={styles.emailContainer}>
            <Pressable onPress={handleEmailPress}>
              <Text style={styles.email}>{email}</Text>
            </Pressable>
            <CopyButton
              value={email || ''}
              successMessage='Email copied to clipboard!'
            />
          </View>

          <Text style={styles.company}>{company}</Text>

          <ActionButton
            onPress={() => setShowBottomSheet(true)}
            text='Actions'
          />
        </View>
      </Card>

      <ContactBottomSheet
        visible={showBottomSheet}
        setVisible={setShowBottomSheet}
        {...data}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  textContent: {
    flex: 1,
    flexDirection: 'column',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSecondary,
  },
  name: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  email: {
    fontSize: typography.sm,
    fontWeight: typography.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textDecorationLine: 'underline',
  },
  company: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.textTertiary,
  },
});

export default ContactBadge;
