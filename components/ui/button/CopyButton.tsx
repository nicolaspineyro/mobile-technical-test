import React from 'react';
import { useClipboard } from '@/hooks/useClipboard';
import { typography, colors } from '@/theme/tokens';
import { Feather } from '@expo/vector-icons';
import IconButton from './IconButton';

interface CopyButtonProps {
  value: string;
  successMessage?: string;
}

const CopyButton = ({ value, successMessage }: CopyButtonProps) => {
  const { copyToClipboard, isCopied } = useClipboard({
    successMessage: successMessage || 'Copied to clipboard!',
    showAlert: true,
  });

  const handleCopy = () => {
    if (value) {
      copyToClipboard(value);
    }
  };

  return (
    <IconButton
      variant='ghost'
      icon={
        <Feather
          name={isCopied ? 'check' : 'copy'}
          size={typography.lg}
          color={isCopied ? colors.success : colors.textTertiary}
        />
      }
      size='sm'
      onPress={handleCopy}
    />
  );
};

export default React.memo(CopyButton);
