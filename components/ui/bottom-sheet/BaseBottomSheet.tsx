import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.bottomSheet}
          onPress={(e) => e.stopPropagation()}
        >
          <Pressable style={styles.handleBar} onPress={onClose} />
          {children}
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
});

export default BaseBottomSheet;
