import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { formatLKR } from '../utils/formatters';
import Badge from './Badge';

// Uber-Inspired Food Item Card.
// Shaped in canonical 16px rounded card with clean typography,
// metadata pill chips, and a signature black 999px CTA pill.
export default function FoodCard({ item, onPress, onQuickAdd }) {
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = () => {
    if (onQuickAdd) {
      onQuickAdd(item);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
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
          variant="outline"
          size="small"
        />
        <Badge
          label={item.spiceLevel || 'Mild'}
          variant={item.spiceLevel === 'Spicy' || item.spiceLevel === 'Very Spicy' ? 'danger' : 'default'}
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
        <Text style={styles.metaText}>
          Prep: {item.preparationTime}
        </Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>
          {item.calories}
        </Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>
          {item.dietary || 'Standard'}
        </Text>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Student Price</Text>
          <Text style={styles.priceValue}>{formatLKR(item.price)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.addPill, justAdded && styles.addPillSuccess]}
          onPress={handleQuickAdd}
          activeOpacity={0.8}
          accessibilityLabel={`Add ${item.name} to order`}
        >
          <Text
            style={[
              styles.addPillText,
              justAdded && styles.addPillTextSuccess,
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
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl, // Canonical 16px card radius
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.ink,
    lineHeight: 22,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  itemDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
    paddingTop: 4,
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
  },
  metaDot: {
    fontSize: 10,
    color: COLORS.mute,
    marginHorizontal: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.mute,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  addPill: {
    backgroundColor: COLORS.primary, // Signature black pill
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: RADIUS.pill, // 999px pill
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPillSuccess: {
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.ink,
  },
  addPillText: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  addPillTextSuccess: {
    color: COLORS.ink,
    fontWeight: FONTS.weights.bold,
  },
});
