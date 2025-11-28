import React from 'react';
import { Pressable, View, StyleSheet, Platform } from 'react-native';
import { hapticImpact } from '@/utils/haptics';
import { colors, radius, spacing } from '@/theme/tokens';
import { ImpactFeedbackStyle } from 'expo-haptics';
import Input from '../ui/Input';
import { BlurView } from 'expo-blur';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface ControlsProps {
  reconnect: () => void;
  disconnect: () => void;
  reset: () => void;
}

const Controls = ({ reconnect, disconnect, reset }: ControlsProps) => {
  return (
    <View style={[styles.wrapper]}>
      <BlurView
        tint='light'
        style={[styles.container]}
        experimentalBlurMethod={
          Platform.OS === 'android' ? 'dimezisBlurView' : 'none'
        }
      >
        <Input />
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [
              styles.buttonPrimary,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              reset();
              reconnect();
            }}
            onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
          >
            <AntDesign name='play-circle' size={22} color='black' />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonSecondary,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              disconnect();
            }}
            onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
          >
            <FontAwesome5 name='stop-circle' size={22} color='black' />
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing['3xl'],
    marginHorizontal: spacing.md,
  },
  wrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: radius.full,
  },

  buttonSecondary: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    padding: spacing.sm,
  },

  buttonPressed: {
    opacity: 0.8,
  },
});

export default Controls;
