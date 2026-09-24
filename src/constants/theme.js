// Uber-Inspired Design System for QuickBite campus food ordering app.
// Built upon a restrained black-and-white duet, geometric display typography,
// and the signature 999px pill shape for all interactive controls.

export const COLORS = {
  // Brand conversion anchors
  primary: '#000000', // Black conversion anchor for primary CTA pills and footer
  onPrimary: '#FFFFFF',
  ink: '#000000', // Deep ink for headings and primary content
  body: '#5E5E5E', // Secondary paragraph text and descriptions
  mute: '#AFAFAF', // Placeholders, timestamps, fine print
  hairlineMid: '#4B4B4B',

  // Canvas and surfaces
  canvas: '#FFFFFF', // Default background
  canvasSoft: '#EFEFEF', // Soft gray fill for chips, form input rows, and subtle pills
  canvasSofter: '#F3F3F3', // Nested input backgrounds
  surfacePressed: '#E2E2E2', // Active / pressed fill for pills and rows
  blackElevated: '#282828', // Elevating dark cards and hover states
  onDark: '#FFFFFF', // Text on dark surfaces

  // Aliases for compatibility
  background: '#F8F9FA', // Clean light gray canvas
  card: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#5E5E5E',
  textMuted: '#8C8C8C',
  border: '#E8E8E8',
  borderDark: '#D0D0D0',
  divider: '#F0F0F0',
  white: '#FFFFFF',
  black: '#000000',
  disabled: '#E5E5E5',
  disabledText: '#AFAFAF',

  // Form validation feedback (restrained)
  danger: '#B91C1C',
  dangerLight: '#FEE2E2',
  success: '#15803D',
  successLight: '#DCFCE7',
  warning: '#B45309',
  warningLight: '#FEF3C7',
  link: '#0000EE',
};

export const RADIUS = {
  none: 0,
  md: 8, // Text inputs and nested control boxes
  lg: 12,
  xl: 16, // Canonical card radius for all content cards and modals
  pill: 999, // Signature interactive shape for buttons, chips, and badges
  pillTab: 36,
  full: 9999,
};

export const SPACING = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
};

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 32,
    displayXl: 36,
    displayXxl: 44,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
  },
};

export const SHADOWS = {
  // Level 0: Flat with border
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  // Level 1: Subtle drop
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  // Level 2: Card drop
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
  // Level 3: Floating pill drop
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  pillFloat: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
};
