import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useClipboard } from '@/hooks/useClipboard';
import { typography, colors } from '@/theme/tokens';
import { hapticImpact } from '@/utils/haptics';
import { Feather } from '@expo/vector-icons';
import { ImpactFeedbackStyle } from 'expo-haptics';

interface CopyButtonProps {
  value: string;
  successMessage?: string;
}

const CopyButton = ({ value, successMessage }: CopyButtonProps) => {
  const { copyToClipboard, isCopied } = useClipboard({
    successMessage: successMessage || 'Copied to clipboard!',
    showAlert: true,
  });

  const handleCopy = () => {
    if (value) {
      copyToClipboard(value);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed]}
      onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
      onPress={handleCopy}
    >
      <Feather
        name={isCopied ? 'check' : 'copy'}
        size={typography.lg}
        color={isCopied ? colors.success : colors.textTertiary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
});

export default React.memo(CopyButton);
