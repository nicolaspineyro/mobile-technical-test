import { colors, radius, spacing, typography } from '@/theme/tokens';
import React from 'react';
import {
  TextInput,
  useColorScheme,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Text,
} from 'react-native';

interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
}

const Input = ({ containerStyle, inputStyle, error, ...props }: InputProps) => {
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';

  return (
    <View
      style={[
        styles.container,
        isDarkMode && styles.containerDark,
        containerStyle,
      ]}
    >
      <View
        style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}
      >
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark, inputStyle]}
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          {...props}
        />
      </View>
      {error && <Text style={[styles.errorText]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
  },
  inputContainerDark: {
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: typography.base,
  },
  inputDark: {
    color: '#fff',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sm,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
