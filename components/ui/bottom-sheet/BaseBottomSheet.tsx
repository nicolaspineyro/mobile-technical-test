import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface BaseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseBottomSheet = ({
  visible,
  onClose,
  children,
}: BaseBottomSheetProps) => {
  const overlayOpacity = useSharedValue(0);
  const translateY = useSharedValue(1000);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });

      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
    } else {
      overlayOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });

      translateY.value = withTiming(1000, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [overlayOpacity, translateY, visible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, overlayAnimatedStyle]}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
        <Animated.View style={[styles.bottomSheet, bottomSheetAnimatedStyle]}>
          <Pressable
            style={styles.contentContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable style={styles.handleBar} onPress={onClose} />
            {children}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  overlayPressable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '70%',
    ...shadows.lg,
  },
  contentContainer: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.cardBorder,
    borderRadius: radius.sm,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
});

export default BaseBottomSheet;
