import { Message } from '@/types/chat.types';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import DynamicComponent from './ComponentRegistry';
import { colors, radius, spacing, typography } from '@/theme/tokens';

interface MessageBubbleProps {
  item: Message;
}

const MessageBubble = ({ item }: MessageBubbleProps) => {
  const { textContent, component, status } = item;
  const dynamicComponenOpacity = useSharedValue(0);

  const isUser = item.role === 'user';

  useEffect(() => {
    if (component?.isComplete) {
      dynamicComponenOpacity.value = withTiming(1, { duration: 400 });
    }
  }, [component?.isComplete, dynamicComponenOpacity]);

  const dynamicComponentStyle = useAnimatedStyle(() => ({
    opacity: dynamicComponenOpacity.value,
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(250).easing(Easing.out(Easing.quad))}
      style={[styles.row, isUser && styles.rowUser]}
    >
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.agentBubble]}
      >
        {textContent && (
          <Animated.Text
            style={[styles.text, isUser ? styles.userText : styles.agentText]}
          >
            {textContent}
          </Animated.Text>
        )}

        {component && (
          <Animated.View style={[dynamicComponentStyle]}>
            <DynamicComponent
              type={component.type}
              fields={component.fields}
              isComplete={component.isComplete}
            />
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingRight: spacing.lg,
  },
  rowUser: {
    justifyContent: 'flex-end',
    paddingRight: 0,
    paddingLeft: spacing.lg,
  },

  bubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: radius.lg,
  },

  userBubble: {
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: radius.sm,
  },
  agentBubble: {
    backgroundColor: colors.agentBubble,
    borderBottomLeftRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

  text: {
    fontSize: typography.base,
    lineHeight: typography.base * typography.lineHeight.normal,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: typography.medium,
  },
  agentText: {
    color: colors.textPrimary,
  },
});

export default MessageBubble;
