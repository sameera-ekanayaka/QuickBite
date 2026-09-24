import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { formatLKR, validateKitchenNotes } from '../utils/formatters';
import { useCart, MIN_ITEM_QUANTITY, MAX_ITEM_QUANTITY } from '../context/CartContext';
import Header from '../components/Header';
import Badge from '../components/Badge';
import QuantitySelector from '../components/QuantitySelector';

// Item Detail View.
// Displays comprehensive dish information, portion modification,
// special kitchen preparation instructions, and dynamic total calculation.
export default function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [notesError, setNotesError] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // If item is missing (fallback guard)
  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Item Not Found" showBack navigation={navigation} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Selected food item is unavailable.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Return to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleIncrement = () => {
    if (quantity < MAX_ITEM_QUANTITY) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > MIN_ITEM_QUANTITY) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleNotesChange = (text) => {
    setKitchenNotes(text);
    const check = validateKitchenNotes(text);
    if (!check.isValid) {
      setNotesError(check.message);
    } else {
      setNotesError('');
    }
  };

  // Add item to shared cart state
  const handleAddToCart = () => {
    const check = validateKitchenNotes(kitchenNotes);
    if (!check.isValid) {
      setNotesError(check.message);
      return;
    }

    addToCart(item, quantity, check.sanitized);
    setAddedSuccess(true);

    // Provide visual confirmation, then navigate back
    setTimeout(() => {
      navigation.navigate('Cart');
    }, 800);
  };

  // Live item total calculation
  const totalItemPrice = item.price * quantity;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title={item.name}
        subtitle={item.counter}
        showBack
        navigation={navigation}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Badge label={item.counter} variant="primary" />
            <Badge label={item.dietary || 'Standard'} variant="info" />
            <Badge
              label={`Spice: ${item.spiceLevel || 'Mild'}`}
              variant={item.spiceLevel === 'Spicy' ? 'danger' : 'warning'}
            />
          </View>

          <Text style={styles.dishTitle}>{item.name}</Text>
          <Text style={styles.dishDescription}>{item.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Preparation</Text>
              <Text style={styles.metaValue}>{item.preparationTime}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Calories</Text>
              <Text style={styles.metaValue}>{item.calories}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Unit Price</Text>
              <Text style={styles.metaPrice}>{formatLKR(item.price)}</Text>
            </View>
          </View>
        </View>

        {/* Ingredients & Dietary Section */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionHeader}>Ingredients & Details</Text>
          <Text style={styles.ingredientsText}>{item.ingredients}</Text>

          <View style={styles.subsidyNotice}>
            <Text style={styles.subsidyNoticeText}>
              Subsidized student rate applied by the University of Kelaniya Canteen Welfare Board.
            </Text>
          </View>
        </View>

        {/* Quantity Selection Section */}
        <View style={styles.quantityCard}>
          <View>
            <Text style={styles.sectionHeader}>Select Quantity</Text>
            <Text style={styles.quantitySubtext}>
              Maximum {MAX_ITEM_QUANTITY} portions per order
            </Text>
          </View>

          <QuantitySelector
            quantity={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            min={MIN_ITEM_QUANTITY}
            max={MAX_ITEM_QUANTITY}
          />
        </View>

        {/* Special Instructions for Canteen Kitchen */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeaderRow}>
            <Text style={styles.sectionHeader}>Kitchen Instructions (Optional)</Text>
            <Text style={styles.characterCount}>
              {kitchenNotes.length}/120
            </Text>
          </View>
          <TextInput
            style={[
              styles.notesInput,
              notesError ? styles.notesInputError : null,
            ]}
            placeholder="e.g. Extra spicy chilli paste, separate dhal gravy..."
            placeholderTextColor={COLORS.textMuted}
            value={kitchenNotes}
            onChangeText={handleNotesChange}
            maxLength={120}
            multiline
            numberOfLines={3}
          />
          {notesError ? (
            <Text style={styles.fieldErrorText}>{notesError}</Text>
          ) : (
            <Text style={styles.inputHint}>
              Instructions will appear directly on the canteen kitchen ticket.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Add to Cart Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalPriceSection}>
          <Text style={styles.totalLabel}>Total ({quantity}x)</Text>
          <Text style={styles.totalAmount}>{formatLKR(totalItemPrice)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            addedSuccess && styles.addToCartButtonSuccess,
          ]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
          accessibilityLabel="Add to order"
        >
          <Text style={styles.addToCartButtonText}>
            {addedSuccess ? 'Added to Cart' : `Add to Cart - ${formatLKR(totalItemPrice)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 110,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.danger,
    marginBottom: SPACING.lg,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  heroHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  dishTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 6,
    lineHeight: 28,
  },
  dishDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  metaLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  metaPrice: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionHeader: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  ingredientsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  subsidyNotice: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.successLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  subsidyNoticeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontWeight: FONTS.weights.medium,
  },
  quantityCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  quantitySubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  instructionsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  instructionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  characterCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  notesInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: SPACING.md,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  notesInputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  fieldErrorText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    marginTop: 4,
  },
  inputHint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.medium,
  },
  totalPriceSection: {
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  addToCartButtonSuccess: {
    backgroundColor: COLORS.success,
  },
  addToCartButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
});
