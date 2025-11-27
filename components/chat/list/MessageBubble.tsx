import { Message } from '@/types/chat.types';
import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
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
  const isUser = item.role === 'user';
  const isComponentBuilding =
    status === 'building' && !!component && !component.isComplete && !isUser;

  const dynamicComponenOpacity = useSharedValue(0);
  const pulse = useSharedValue(0.3);

  const dynamicComponentStyle = useAnimatedStyle(() => ({
    opacity: dynamicComponenOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
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
          <Text
            style={[styles.text, isUser ? styles.userText : styles.agentText]}
          >
            {textContent}
          </Text>
        )}
        {isComponentBuilding && (
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingDot, pulseStyle]} />
          </View>
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
    padding: spacing.md,
    borderRadius: radius.lg,
  },

  userBubble: {
    maxWidth: '80%',
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: radius.xs,
  },
  agentBubble: {
    width: '100%',
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
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
