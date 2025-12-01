import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import Pressable from './Pressable';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title?: string;
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';

  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  loading?: boolean;

  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;

  customColors?: {
    background?: string;
    text?: string;
    border?: string;
  };

  style?: StyleProp<ViewStyle>;
}

const Button = ({
  title,
  icon,
  iconPosition = 'left',
  onPress,
  onLongPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  customColors,
  style,
}: ButtonProps) => {
  const variantStyles = getVariantStyles(variant, customColors);
  const sizeStyles = getSizeStyles(size);

  const isDisabled = disabled || loading;
  const shouldShowIconLeft = icon && (!title || iconPosition === 'left');
  const shouldShowIconRight = icon && title && iconPosition === 'right';

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size='small' color={variantStyles.text.color} />
      ) : (
        <>
          {shouldShowIconLeft && (
            <View style={[styles.iconContainer, title && styles.iconWithText]}>
              {icon}
            </View>
          )}

          {title && (
            <Text
              numberOfLines={1}
              style={[styles.title, variantStyles.text, sizeStyles.text]}
            >
              {title}
            </Text>
          )}

          {shouldShowIconRight && (
            <View style={[styles.iconContainer, styles.iconWithText]}>
              {icon}
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

const getVariantStyles = (
  variant: ButtonVariant,
  customColors?: ButtonProps['customColors']
) => {
  const variants = {
    primary: {
      container: {
        backgroundColor: customColors?.background || colors.primary,
        borderWidth: 0,
      },
      text: { color: customColors?.text || colors.textPrimary },
    },
    secondary: {
      container: {
        backgroundColor: customColors?.background || colors.cardBackground,
        borderWidth: 1,
        borderColor: customColors?.border || colors.cardBorder,
      },
      text: { color: customColors?.text || colors.textPrimary },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: customColors?.border || colors.primary,
      },
      text: { color: customColors?.text || colors.textPrimary },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      text: { color: customColors?.text || colors.textPrimary },
    },
    text: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      text: {
        color: customColors?.text || colors.textPrimary,
        textDecorationColor: customColors?.text || colors.textPrimary,
        textDecorationLine: 'underline',
      },
    },
  };
  return variants[variant];
};

const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    sm: {
      container: {
        height: spacing['3xl'],
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
      },
      text: { fontSize: typography.sm },
    },
    md: {
      container: {
        height: spacing['3xl'] + spacing.xs,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
      },
      text: { fontSize: typography.base },
    },
    lg: {
      container: {
        height: spacing['3xl'] + spacing.md,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
      },
      text: { fontSize: typography.lg },
    },
  };

  return sizes[size];
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  title: {
    fontWeight: '600',
    flexShrink: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWithText: {
    marginHorizontal: 4,
  },
});

export default Button;
