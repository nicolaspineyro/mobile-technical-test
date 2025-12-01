import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Appearance,
  Dimensions,
} from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import { BlurView } from 'expo-blur';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import IconButton from '../ui/button/IconButton';
import Input from '../ui/Input';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { easeGradient } from 'react-native-easing-gradient';

const { height } = Dimensions.get('window');

interface ControlsProps {
  isConnected: boolean;
  reconnect: () => void;
  disconnect: () => void;
  reset: () => void;
}

const Controls = ({
  isConnected,
  reconnect,
  disconnect,
  reset,
}: ControlsProps) => {
  const colorScheme = Appearance.getColorScheme();

  const { colors: maskColors, locations } = easeGradient({
    colorStops: {
      0: { color: 'transparent' },
      1: { color: '#ffffff' },
    },
  });

  const handleStart = () => {
    reset();
    reconnect();
  };

  return (
    <View style={styles.wrapper}>
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <LinearGradient
            colors={maskColors as any}
            locations={locations as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <BlurView
          intensity={100}
          style={[StyleSheet.absoluteFill]}
          experimentalBlurMethod={
            Platform.OS === 'android' ? 'dimezisBlurView' : 'none'
          }
        />
      </MaskedView>

      <BlurView
        style={styles.controls}
        tint='prominent'
        intensity={100}
        experimentalBlurMethod={
          Platform.OS === 'android' ? 'dimezisBlurView' : 'none'
        }
      >
        <Input
          inputStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }}
          multiline
          placeholder='This is a dummy test Input...'
        />

        <View style={styles.buttons}>
          <IconButton
            icon={<AntDesign name='play-circle' size={22} color='black' />}
            variant='solid'
            onPress={handleStart}
          />
          <IconButton
            icon={<FontAwesome5 name='stop-circle' size={22} color='black' />}
            variant='solid'
            backgroundColor={colors.accent}
            onPress={disconnect}
            disabled={!isConnected}
          />
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 11,
    height: Platform.OS === 'android' ? height * 0.19 : height * 0.17,
  },

  controls: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});

export default Controls;
