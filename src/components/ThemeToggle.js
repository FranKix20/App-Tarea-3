// src/components/ThemeToggle.js
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

export default function ThemeToggle() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';
  const anim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: false,
      tension: 70,
      friction: 8,
    }).start();
  }, [isDark]);

  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 24],
  });

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F0DDD2', '#2C1E14'],
  });

  return (
    <TouchableOpacity onPress={toggleTheme} activeOpacity={0.85}>
      <View style={styles.wrapper}>
        <Text style={[styles.icon]}>{isDark ? '🌙' : '☀️'}</Text>
        <Animated.View style={[styles.track, { backgroundColor: trackBg, borderColor: theme.border.default }]}>
          <Animated.View
            style={[
              styles.thumb,
              {
                backgroundColor: theme.accent.primary,
                transform: [{ translateX: thumbTranslate }],
              },
            ]}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 15,
  },
  track: {
    width: 48,
    height: 26,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.pill,
  },
});
