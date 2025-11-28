import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { radius, spacing } from '@/theme/tokens';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

interface ActionButtonProps {
  onPress: () => void;
  text: string;
  style?: any;
}

const ActionButton = ({ onPress, text, style }: ActionButtonProps) => {
  const handleHaptic = () => hapticImpact(ImpactFeedbackStyle.Light);
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
      onPress={onPress}
      onPressIn={handleHaptic}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
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
});

export default React.memo(ActionButton);
