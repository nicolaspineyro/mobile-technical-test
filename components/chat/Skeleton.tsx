import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { radius } from '@/theme/tokens';

const Skeleton = () => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.skeletonContainer, animatedStyle]}>
      <BlurView
        intensity={20}
        tint='light'
        style={[styles.skeletonContainer]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    height: 90,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  skeletonBlur: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Skeleton;
