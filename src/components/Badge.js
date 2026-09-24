import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

// Uber-Inspired Pill Badge Component.
// Uses the signature 999px pill geometry for metadata chips,
// dietary markers, and order status indicators.
export default function Badge({
  label,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
          text: { color: COLORS.onPrimary },
        };
      case 'dark':
        return {
          container: { backgroundColor: COLORS.blackElevated, borderColor: COLORS.blackElevated },
          text: { color: COLORS.onDark },
        };
      case 'success':
        return {
          container: { backgroundColor: COLORS.canvasSoft, borderColor: COLORS.ink },
          text: { color: COLORS.ink, fontWeight: FONTS.weights.bold },
        };
      case 'warning':
        return {
          container: { backgroundColor: COLORS.canvasSoft, borderColor: COLORS.surfacePressed },
          text: { color: COLORS.ink },
        };
      case 'danger':
        return {
          container: { backgroundColor: COLORS.dangerLight, borderColor: COLORS.danger },
          text: { color: COLORS.danger },
        };
      case 'info':
        return {
          container: { backgroundColor: COLORS.canvasSoft, borderColor: COLORS.surfacePressed },
          text: { color: COLORS.body },
        };
      case 'outline':
        return {
          container: { backgroundColor: COLORS.canvas, borderColor: COLORS.surfacePressed },
          text: { color: COLORS.ink },
        };
      default:
        return {
          container: { backgroundColor: COLORS.canvasSoft, borderColor: 'transparent' },
          text: { color: COLORS.ink },
        };
    }
  };

  const isSmall = size === 'small';
  const variantStyle = getVariantStyles();

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
        variantStyle.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isSmall ? styles.textSmall : styles.textMedium,
          variantStyle.text,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.pill, // Signature Uber 999px pill radius
    borderWidth: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSmall: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
  },
  badgeMedium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  text: {
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
    letterSpacing: 0,
  },
  textSmall: {
    fontSize: FONTS.sizes.xs,
  },
  textMedium: {
    fontSize: FONTS.sizes.sm,
  },
});
