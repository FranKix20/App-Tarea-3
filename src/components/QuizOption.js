// src/components/QuizOption.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING, RADIUS } from '../theme';

export default function QuizOption({ emoji, label, sublabel, selected, onPress }) {
  const { theme } = useTheme();
  // Native driver: only transform (scale)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // JS driver: colors (cannot use native driver)
  const colorAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    // colorAnim: JS driver only — interpolates colors
    Animated.timing(colorAnim, {
      toValue: selected ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();

    // scaleAnim: native driver only — scale transform
    Animated.spring(scaleAnim, {
      toValue: selected ? 1.02 : 1,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [selected]);

  const handlePress = () => {
    // Quick press bounce using native driver
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }),
      Animated.spring(scaleAnim, {
        toValue: selected ? 1 : 1.02,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
    ]).start();
    onPress();
  };

  const borderColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.quiz.optionBorder, theme.quiz.optionBorderSelected],
  });

  const bgColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.quiz.optionBg, theme.quiz.optionSelected],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      {/* Outer: JS-driven colors (no native driver) */}
      <Animated.View
        style={[
          styles.colorLayer,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
          },
        ]}
      >
        {/* Inner: native-driver scale */}
        <Animated.View
          style={[
            styles.scaleLayer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[
            styles.emojiContainer,
            { backgroundColor: selected ? theme.accent.soft : theme.bg.secondary },
          ]}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={[
              styles.label,
              {
                color: selected ? theme.accent.primary : theme.text.primary,
                fontWeight: selected ? FONTS.weights.bold : FONTS.weights.medium,
              },
            ]}>
              {label}
            </Text>
            {sublabel ? (
              <Text style={[styles.sublabel, { color: theme.text.secondary }]}>
                {sublabel}
              </Text>
            ) : null}
          </View>

          <View style={[
            styles.checkCircle,
            {
              backgroundColor: selected ? theme.quiz.checkBg : 'transparent',
              borderColor: selected ? theme.quiz.checkBg : theme.border.default,
              borderWidth: 2,
            },
          ]}>
            {selected && (
              <Text style={[styles.checkMark, { color: theme.quiz.checkColor }]}>✓</Text>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  colorLayer: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  scaleLayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: FONTS.sizes.md,
    letterSpacing: -0.2,
  },
  sublabel: {
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
    lineHeight: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 13,
    fontWeight: '800',
  },
});
