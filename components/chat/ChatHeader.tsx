import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Appearance,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import TMFCLogo from '../icons/TMFCLogo';
import { LinearGradient } from 'expo-linear-gradient';
import { easeGradient } from 'react-native-easing-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors as themeColors, spacing } from '@/theme/tokens';
import IconButton from '../ui/button/IconButton';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

interface ChatHeaderProps {
  isConnected: boolean;
  error: string | null;
}

const ChatHeader = ({ isConnected, error }: ChatHeaderProps) => {
  const insets = useSafeAreaInsets();
  const colorScheme = Appearance.getColorScheme();
  const handleBack = () => router.back();

  const { colors, locations } = easeGradient({
    colorStops: {
      0: { color: '#ffff' },
      1: { color: 'transparent' },
    },
  });

  return (
    <View style={styles.headerWrapper}>
      <MaskedView
        maskElement={
          <LinearGradient
            locations={locations as any}
            colors={colors as any}
            start={{ x: 0, y: 0.8 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        }
        style={[StyleSheet.absoluteFill]}
      >
        <BlurView
          intensity={100}
          style={[StyleSheet.absoluteFill]}
          experimentalBlurMethod={
            Platform.OS === 'android' ? 'dimezisBlurView' : 'none'
          }
        />
      </MaskedView>

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.content}>
          <IconButton
            variant='ghost'
            size='sm'
            icon={<AntDesign name='left' size={20} />}
            onPress={handleBack}
          />
          <TMFCLogo
            fill={colorScheme === 'dark' ? 'white' : 'black'}
            width={250}
            height={30}
          />
          <IconButton
            disabled
            onPress={() => {}}
            icon={
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isConnected
                      ? themeColors.success
                      : themeColors.textTertiary,
                  },
                ]}
              />
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: Platform.OS === 'android' ? height * 0.11 : height * 0.145,
  },
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default ChatHeader;
