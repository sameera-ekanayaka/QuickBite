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
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { formatLKR, validateKitchenNotes } from '../utils/formatters';
import { useCart, MIN_ITEM_QUANTITY, MAX_ITEM_QUANTITY } from '../context/CartContext';
import Header from '../components/Header';
import Badge from '../components/Badge';
import QuantitySelector from '../components/QuantitySelector';

// Uber-Inspired Item Detail View.
// Framed in canonical 16px cards, canvas-soft inputs,
// and a signature black 999px conversion pill.
export default function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [notesError, setNotesError] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Item not found" showBack navigation={navigation} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Selected item is currently unavailable.</Text>
          <TouchableOpacity
            style={styles.backPill}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backPillText}>Return to menu</Text>
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

  const handleAddToCart = () => {
    const check = validateKitchenNotes(kitchenNotes);
    if (!check.isValid) {
      setNotesError(check.message);
      return;
    }

    addToCart(item, quantity, check.sanitized);
    setAddedSuccess(true);

    setTimeout(() => {
      navigation.navigate('Cart');
    }, 750);
  };

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
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroPillsRow}>
            <Badge label={item.counter} variant="primary" size="small" />
            <Badge label={item.dietary || 'Standard'} variant="outline" size="small" />
            <Badge label={`Spice: ${item.spiceLevel || 'Mild'}`} variant="default" size="small" />
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

        {/* Ingredients Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardHeading}>Ingredients & details</Text>
          <Text style={styles.ingredientsBody}>{item.ingredients}</Text>
          <View style={styles.subsidyNoticeRow}>
            <Text style={styles.subsidyNoticeText}>
              Subsidized student rate applied by the Canteen Welfare Board.
            </Text>
          </View>
        </View>

        {/* Quantity Card */}
        <View style={styles.quantityCard}>
          <View>
            <Text style={styles.cardHeading}>Quantity</Text>
            <Text style={styles.quantitySubtext}>
              Max {MAX_ITEM_QUANTITY} portions per order
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

        {/* Special Instructions Card */}
        <View style={styles.cardContainer}>
          <View style={styles.instructionsHeaderRow}>
            <Text style={styles.cardHeading}>Kitchen instructions (optional)</Text>
            <Text style={styles.charCount}>{kitchenNotes.length}/120</Text>
          </View>
          <TextInput
            style={[
              styles.notesInputRow,
              notesError ? styles.notesInputRowError : null,
            ]}
            placeholder="e.g. Extra spicy chilli paste, separate dhal gravy..."
            placeholderTextColor={COLORS.mute}
            value={kitchenNotes}
            onChangeText={handleNotesChange}
            maxLength={120}
            multiline
            numberOfLines={3}
          />
          {notesError ? (
            <Text style={styles.errorTextSmall}>{notesError}</Text>
          ) : (
            <Text style={styles.hintText}>
              Instructions will appear on your canteen kitchen ticket.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarLabel}>Total ({quantity}x)</Text>
          <Text style={styles.bottomBarPrice}>{formatLKR(totalItemPrice)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.addOrderPill, addedSuccess && styles.addOrderPillSuccess]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
          accessibilityLabel="Add to order"
        >
          <Text style={styles.addOrderPillText}>
            {addedSuccess ? 'Added to order' : `Add to order - ${formatLKR(totalItemPrice)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.canvas,
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
    fontSize: FONTS.sizes.sm,
    color: COLORS.body,
    marginBottom: SPACING.lg,
  },
  backPill: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
  },
  backPillText: {
    color: COLORS.onPrimary,
    fontWeight: FONTS.weights.bold,
  },
  heroCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl, // 16px
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  heroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  dishTitle: {
    fontSize: FONTS.sizes.displaySm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  dishDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.body,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.surfacePressed,
  },
  metaLabel: {
    fontSize: 10,
    color: COLORS.mute,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.ink,
  },
  metaPrice: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  cardContainer: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl, // 16px
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  cardHeading: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    marginBottom: 6,
  },
  ingredientsBody: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
    lineHeight: 20,
  },
  subsidyNoticeRow: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.canvasSoft,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  subsidyNoticeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
  },
  quantityCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantitySubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
    marginTop: 2,
  },
  instructionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  charCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
  },
  notesInputRow: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.md, // 8px
    padding: SPACING.md,
    fontSize: FONTS.sizes.sm,
    color: COLORS.ink,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  notesInputRowError: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  errorTextSmall: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    marginTop: 4,
  },
  hintText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.canvas,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarLabel: {
    fontSize: 10,
    color: COLORS.mute,
    textTransform: 'uppercase',
  },
  bottomBarPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  addOrderPill: {
    backgroundColor: COLORS.primary, // Signature black pill
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill, // 999px pill
    alignItems: 'center',
  },
  addOrderPillSuccess: {
    backgroundColor: COLORS.hairlineMid,
  },
  addOrderPillText: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
});
