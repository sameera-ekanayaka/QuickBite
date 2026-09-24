import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { MIN_ITEM_QUANTITY, MAX_ITEM_QUANTITY } from '../context/CartContext';

// Uber-Inspired Quantity Stepper Component.
// Encased in a signature 999px pill container with crisp tactile buttons.
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
        activeOpacity={0.7}
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
        activeOpacity={0.7}
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
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.pill, // Signature 999px pill shape
    padding: 3,
  },
  containerSmall: {
    padding: 2,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.canvas,
  },
  buttonSmall: {
    width: 26,
    height: 26,
  },
  buttonDisabled: {
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    lineHeight: 20,
  },
  buttonTextDisabled: {
    color: COLORS.mute,
  },
  valueContainer: {
    minWidth: 32,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainerSmall: {
    minWidth: 24,
    paddingHorizontal: SPACING.xs,
  },
  valueText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  valueTextSmall: {
    fontSize: FONTS.sizes.xs,
  },
});
