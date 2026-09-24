import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

// Visual text badge component used for food tags, dietary markers,
// counters, and order statuses without relying on emojis.
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
          container: { backgroundColor: COLORS.primaryMuted, borderColor: COLORS.primary },
          text: { color: COLORS.primary },
        };
      case 'success':
        return {
          container: { backgroundColor: COLORS.successLight, borderColor: COLORS.success },
          text: { color: COLORS.success },
        };
      case 'warning':
        return {
          container: { backgroundColor: COLORS.warningLight, borderColor: COLORS.warning },
          text: { color: COLORS.warning },
        };
      case 'danger':
        return {
          container: { backgroundColor: COLORS.dangerLight, borderColor: COLORS.danger },
          text: { color: COLORS.danger },
        };
      case 'info':
        return {
          container: { backgroundColor: COLORS.infoLight, borderColor: COLORS.info },
          text: { color: COLORS.info },
        };
      case 'outline':
        return {
          container: { backgroundColor: 'transparent', borderColor: COLORS.borderDark },
          text: { color: COLORS.textSecondary },
        };
      default:
        return {
          container: { backgroundColor: COLORS.border, borderColor: 'transparent' },
          text: { color: COLORS.textSecondary },
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
    borderWidth: 1,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSmall: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  badgeMedium: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  text: {
    fontWeight: FONTS.weights.semibold,
    textAlign: 'center',
  },
  textSmall: {
    fontSize: FONTS.sizes.xs,
  },
  textMedium: {
    fontSize: FONTS.sizes.sm,
  },
});
