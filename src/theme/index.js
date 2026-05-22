// src/theme/index.js

export const FONTS = {
  regular: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 36,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

const LIGHT_THEME = {
  mode: 'light',
  bg: {
    primary: '#FFF8F3',
    secondary: '#FCEEE4',
    card: '#FFFFFF',
    input: '#FDF3EC',
    overlay: 'rgba(0,0,0,0.04)',
    accent: '#FFF0E8',
  },
  text: {
    primary: '#1C1410',
    secondary: '#7A6355',
    placeholder: '#BBA99D',
    inverse: '#FFFFFF',
    accent: '#D4541A',
  },
  border: {
    default: '#F0DDD2',
    focus: '#D4541A',
    error: '#E03030',
    selected: '#D4541A',
  },
  accent: {
    primary: '#D4541A',
    secondary: '#F07840',
    soft: '#FDEADE',
    glow: 'rgba(212,84,26,0.15)',
  },
  status: {
    success: '#2D9E6B',
    error: '#E03030',
    warning: '#D4922A',
  },
  shadow: {
    color: '#000',
    opacity: 0.06,
  },
  quiz: {
    optionBg: '#FFFFFF',
    optionBorder: '#F0DDD2',
    optionSelected: '#FFF0E8',
    optionBorderSelected: '#D4541A',
    checkBg: '#D4541A',
    checkColor: '#FFFFFF',
  },
};

const DARK_THEME = {
  mode: 'dark',
  bg: {
    primary: '#0D0A08',
    secondary: '#1A1410',
    card: '#1E1914',
    input: '#271E18',
    overlay: 'rgba(255,255,255,0.03)',
    accent: '#2C1E14',
  },
  text: {
    primary: '#F5EDE6',
    secondary: '#9C8070',
    placeholder: '#5C4A3C',
    inverse: '#1C1410',
    accent: '#F07840',
  },
  border: {
    default: '#2E2218',
    focus: '#F07840',
    error: '#E05A5A',
    selected: '#F07840',
  },
  accent: {
    primary: '#F07840',
    secondary: '#D4541A',
    soft: '#321A0A',
    glow: 'rgba(240,120,64,0.18)',
  },
  status: {
    success: '#4CAF7D',
    error: '#E05A5A',
    warning: '#E0AB4A',
  },
  shadow: {
    color: '#000',
    opacity: 0.4,
  },
  quiz: {
    optionBg: '#1E1914',
    optionBorder: '#2E2218',
    optionSelected: '#2C1E14',
    optionBorderSelected: '#F07840',
    checkBg: '#F07840',
    checkColor: '#0D0A08',
  },
};

export const getTheme = (mode) => (mode === 'dark' ? DARK_THEME : LIGHT_THEME);
