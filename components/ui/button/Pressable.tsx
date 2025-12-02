import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import React from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface PressableProps extends Omit<RNPressableProps, 'style'> {
  children: React.ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  scale?: number;
  animationDuration?: number;
  hapticFeedback?: boolean;
  hapticStyle?: ImpactFeedbackStyle;
  style?: any;
  pressedStyle?: any;
}

const Pressable = ({
  children,
  disabled = false,
  onPress,
  onLongPress,
  scale = 0.95,
  animationDuration = 150,
  hapticFeedback = true,
  hapticStyle = ImpactFeedbackStyle.Medium,
  style,
  pressedStyle,
  ...restProps
}: PressableProps) => {
  const transition = useSharedValue(0);
  const isActive = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(transition.value, [0, 1], [1, scale]),
      },
    ],
  }));

  const handlePressIn = () => {
    if (disabled) return;

    isActive.value = true;

    if (hapticFeedback) {
      hapticImpact(hapticStyle);
    }

    transition.value = withTiming(
      1,
      { duration: animationDuration, easing: Easing.out(Easing.quad) },
      () => {
        if (!isActive.value) {
          transition.value = withTiming(0, {
            duration: animationDuration,
            easing: Easing.out(Easing.quad),
          });
        }
      }
    );
  };

  const handlePressOut = () => {
    if (transition.value === 1) {
      transition.value = withTiming(0, {
        duration: animationDuration,
        easing: Easing.out(Easing.quad),
      });
    }
    isActive.value = false;
  };

  return (
    <RNPressable
      disabled={disabled}
      hitSlop={16}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...restProps}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            animatedStyle,
            style,
            pressed && pressedStyle,
            { opacity: disabled ? 0.5 : 1 },
          ]}
        >
          {children}
        </Animated.View>
      )}
    </RNPressable>
  );
};

export default Pressable;
