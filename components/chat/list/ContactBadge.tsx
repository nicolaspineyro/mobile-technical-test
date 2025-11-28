import React, { useState } from 'react';
import { ContactBadgeFields } from '@/types/chat.types';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import ContactBottomSheet from '@/components/ui/ContactBottomSheet';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import Feather from '@expo/vector-icons/Feather';
import { useClipboard } from '@/hooks/useClipboard';

interface ContactBadgeProps {
  data: Partial<ContactBadgeFields>;
}

const ContactBadge = ({ data }: ContactBadgeProps) => {
  const { name, email, company, profilePicture } = data;
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { copyToClipboard, isCopied } = useClipboard({
    successMessage: 'Email copied to clipboard!',
    showAlert: true,
  });

  const handleLongPress = () => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    setShowBottomSheet(true);
  };

  const handleCopy = () => {
    if (email) {
      copyToClipboard(email);
    }
  };

  return (
    <>
      <Pressable onLongPress={handleLongPress} style={styles.container}>
        <Image
          source={{ uri: profilePicture }}
          style={styles.avatar}
          contentFit='cover'
          transition={200}
        />
        <View style={styles.footer}>
          <View style={styles.content}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.emailContainer}>
              <Text style={styles.email}>{email}</Text>
              <Pressable
                style={({ pressed }) => [pressed && styles.buttonPressed]}
                onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
                onPress={handleCopy}
              >
                <Feather
                  name={isCopied ? 'check' : 'copy'}
                  size={typography.lg}
                  color={isCopied ? colors.success : colors.textTertiary}
                />
              </Pressable>
            </View>
            <Text style={styles.company}>{company}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.buttonPrimary,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setShowBottomSheet(true)}
            onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
          >
            <Text style={styles.buttonText}>Actions</Text>
          </Pressable>
        </View>
      </Pressable>

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
    backgroundColor: colors.cardBackground,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: spacing.md,
    gap: spacing.lg,
  },

  content: {
    flex: 1,
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
  },

  company: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.textTertiary,
  },

  buttonPrimary: {
    backgroundColor: 'transparent',
    padding: spacing.sm,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },

  buttonText: {
    textDecorationColor: 'black',
    textDecorationLine: 'underline',
  },

  buttonPressed: {
    opacity: 0.8,
  },

  footer: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default ContactBadge;
