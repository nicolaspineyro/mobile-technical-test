import React from 'react';
import { StyleSheet } from 'react-native';
import { colors, radius } from '@/theme/tokens';
import Pressable from './Pressable';

export interface IconButtonProps {
  icon: React.ReactElement;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;

  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';

  backgroundColor?: string;
  borderColor?: string;

  style?: any;
}

const IconButton = ({
  icon,
  onPress,
  onLongPress,
  disabled = false,
  variant = 'ghost',
  size = 'md',
  backgroundColor,
  borderColor,
  style,
}: IconButtonProps) => {
  const sizeStyle = iconSizeStyles[size];
  const variantStyle = iconVariantStyles(variant, backgroundColor, borderColor);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[iconStyles.container, sizeStyle, variantStyle, style]}
    >
      {icon}
    </Pressable>
  );
};

const iconSizeStyles = {
  sm: { width: 32, height: 32, borderRadius: radius.full },
  md: { width: 40, height: 40, borderRadius: radius.full },
  lg: { width: 48, height: 48, borderRadius: radius.full },
};

const iconVariantStyles = (
  variant: IconButtonProps['variant'],
  bgColor?: string,
  bdColor?: string
) => {
  const variants = {
    solid: {
      backgroundColor: bgColor || colors.primary,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: bdColor || colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };
  return variants[variant!];
};

const iconStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconButton;
