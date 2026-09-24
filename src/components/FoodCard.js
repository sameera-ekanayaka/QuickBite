import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { formatLKR } from '../utils/formatters';
import Badge from './Badge';

// Reusable menu item card.
// Shows dish name, canteen counter, prep time, price in LKR,
// and direct quick-add action.
export default function FoodCard({ item, onPress, onQuickAdd }) {
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = () => {
    if (onQuickAdd) {
      onQuickAdd(item);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  // Determine spice badge variant
  const getSpiceVariant = (level) => {
    if (level === 'Very Spicy' || level === 'Spicy') return 'danger';
    if (level === 'Medium') return 'warning';
    return 'outline';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.7}
      accessibilityLabel={`View details for ${item.name}`}
    >
      <View style={styles.headerRow}>
        <Badge
          label={item.counter}
          variant="primary"
          size="small"
        />
        <Badge
          label={item.spiceLevel || 'Mild'}
          variant={getSpiceVariant(item.spiceLevel)}
          size="small"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.prepTime}>
          Prep: {item.preparationTime}
        </Text>
        <Text style={styles.calories}>
          {item.calories}
        </Text>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Student Price</Text>
          <Text style={styles.priceValue}>{formatLKR(item.price)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, justAdded && styles.addButtonSuccess]}
          onPress={handleQuickAdd}
          activeOpacity={0.8}
          accessibilityLabel={`Add ${item.name} to cart`}
        >
          <Text
            style={[
              styles.addButtonText,
              justAdded && styles.addButtonTextSuccess,
            ]}
          >
            {justAdded ? 'Added' : '+ Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  body: {
    marginVertical: SPACING.xs,
  },
  itemName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.xs,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  prepTime: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  calories: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonSuccess: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
  addButtonTextSuccess: {
    color: COLORS.success,
  },
});
