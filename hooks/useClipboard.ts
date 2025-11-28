import { useState, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

interface UseClipboardOptions {
  successMessage?: string;
  showAlert?: boolean;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { successMessage = 'Copied to clipboard!', showAlert = true } = options;
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await Clipboard.setStringAsync(text);
        setIsCopied(true);

        if (showAlert) {
          Alert.alert('Success', successMessage);
        }

        setTimeout(() => setIsCopied(false), 2000);

        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        if (showAlert) {
          Alert.alert('Error', 'Failed to copy to clipboard');
        }
        return false;
      }
    },
    [successMessage, showAlert]
  );

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await Clipboard.getStringAsync();
      return text;
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
      return null;
    }
  }, []);

  const hasString = useCallback(async () => {
    try {
      return await Clipboard.hasStringAsync();
    } catch (error) {
      console.error('Failed to check clipboard:', error);
      return false;
    }
  }, []);

  return {
    copyToClipboard,
    pasteFromClipboard,
    hasString,
    isCopied,
  };
}
