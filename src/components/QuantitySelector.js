import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { MIN_ITEM_QUANTITY, MAX_ITEM_QUANTITY } from '../context/CartContext';

// Reusable stepper component for adjusting meal portions.
// Enforces minimum (1) and maximum (20) quantity bounds with visual feedback.
export default function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = MIN_ITEM_QUANTITY,
  max = MAX_ITEM_QUANTITY,
  size = 'medium',
}) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <TouchableOpacity
        style={[
          styles.button,
          isSmall && styles.buttonSmall,
          isMin && styles.buttonDisabled,
        ]}
        onPress={onDecrement}
        disabled={isMin}
        accessibilityLabel="Decrease quantity"
      >
        <Text style={[styles.buttonText, isMin && styles.buttonTextDisabled]}>-</Text>
      </TouchableOpacity>

      <View style={[styles.valueContainer, isSmall && styles.valueContainerSmall]}>
        <Text style={[styles.valueText, isSmall && styles.valueTextSmall]}>
          {quantity}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          isSmall && styles.buttonSmall,
          isMax && styles.buttonDisabled,
        ]}
        onPress={onIncrement}
        disabled={isMax}
        accessibilityLabel="Increase quantity"
      >
        <Text style={[styles.buttonText, isMax && styles.buttonTextDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 2,
  },
  containerSmall: {
    padding: 1,
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
  },
  buttonSmall: {
    width: 28,
    height: 28,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  buttonTextDisabled: {
    color: COLORS.disabledText,
  },
  valueContainer: {
    minWidth: 36,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainerSmall: {
    minWidth: 26,
    paddingHorizontal: SPACING.xs,
  },
  valueText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  valueTextSmall: {
    fontSize: FONTS.sizes.sm,
  },
});
