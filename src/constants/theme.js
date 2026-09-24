// Theme definition for QuickBite campus food ordering app.
// Styled according to the University of Kelaniya institutional palette,
// utilizing deep maroon, warm amber, and clean slate neutrals.

export const COLORS = {
  // Brand identity colors
  primary: '#800000', // University of Kelaniya Maroon
  primaryDark: '#5B0000',
  primaryLight: '#A31D1D',
  primaryMuted: '#FDF2F2',

  // Accent colors
  accent: '#D97706', // Warm amber for alerts and highlights
  accentLight: '#FEF3C7',

  // Semantic feedback colors
  success: '#15803D',
  successLight: '#DCFCE7',
  warning: '#B45309',
  warningLight: '#FEF3C7',
  danger: '#B91C1C',
  dangerLight: '#FEE2E2',
  info: '#1D4ED8',
  infoLight: '#DBEAFE',

  // Neutral scale
  background: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderDark: '#CBD5E1',
  divider: '#F1F5F9',

  // Interactive states
  disabled: '#CBD5E1',
  disabledText: '#94A3B8',
  white: '#FFFFFF',
  black: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

export const FONTS = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    title: 28,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
};
