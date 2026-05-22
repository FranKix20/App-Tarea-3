// src/components/QuizSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING, RADIUS } from '../theme';

export default function QuizSection({ number, title, subtitle, children, accent }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
      <View style={styles.header}>
        <View style={[styles.numberBadge, { backgroundColor: accent || theme.accent.primary }]}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  numberBadge: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  numberText: {
    color: '#FFF',
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.black,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    marginTop: 3,
    lineHeight: 18,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
});
