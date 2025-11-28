import { Message } from '@/types/chat.types';
import React, { useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
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
  const { textContent, component } = item;
  const isUser = item.role === 'user';
  const dynamicComponenOpacity = useSharedValue(0);

  const dynamicComponentStyle = useAnimatedStyle(() => ({
    opacity: dynamicComponenOpacity.value,
  }));

  useEffect(() => {
    if (component?.isComplete) {
      dynamicComponenOpacity.value = withTiming(1, { duration: 400 });
    }
  }, [component?.isComplete, dynamicComponenOpacity]);

  return (
    <Animated.View
      entering={FadeInDown.duration(250).easing(Easing.out(Easing.quad))}
      style={[styles.row, isUser && styles.rowUser]}
    >
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.agentBubble]}
      >
        {textContent && (
          <TextInput
            value={textContent}
            selectionColor={'gray'}
            editable={false}
            multiline={true}
            selectTextOnFocus={false}
            style={[styles.text, isUser ? styles.userText : styles.agentText]}
          />
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
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    borderRadius: radius.xl,
  },
  userBubble: {
    maxWidth: '75%',
    padding: spacing.md,
    backgroundColor: colors.userBubble,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  agentBubble: {
    width: '100%',
  },
  text: {
    fontSize: typography.base,
    lineHeight: typography.base * typography.lineHeight.tight,
    padding: 0,
  },
  userText: {
    color: colors.background,
    fontWeight: typography.medium,
  },
  agentText: {
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.textPrimary,
  },
});

export default React.memo(MessageBubble, (prevProps, nextProps) => {
  return (
    prevProps.item.textContent === nextProps.item.textContent &&
    prevProps.item.status === nextProps.item.status &&
    prevProps.item.component?.isComplete ===
      nextProps.item.component?.isComplete
  );
});
