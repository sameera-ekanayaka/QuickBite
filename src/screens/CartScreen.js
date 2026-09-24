import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { formatLKR } from '../utils/formatters';
import { useCart, MIN_ITEM_QUANTITY, MAX_ITEM_QUANTITY } from '../context/CartContext';
import Header from '../components/Header';
import QuantitySelector from '../components/QuantitySelector';
import Badge from '../components/Badge';

// Cart Screen for QuickBite campus food ordering app.
// Reads shared state from CartContext, calculates subtotal, container fee,
// and enforces empty cart blocking before proceeding to checkout.
export default function CartScreen({ navigation }) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    isTakeaway,
    toggleTakeaway,
    subtotal,
    itemCount,
    packagingFee,
    grandTotal,
  } = useCart();

  // Handle quantity decrement with confirmation prompt if quantity reaches 0
  const handleDecrement = (cartItem) => {
    if (cartItem.quantity <= 1) {
      Alert.alert(
        'Remove Item',
        `Remove "${cartItem.item.name}" from your order?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeFromCart(cartItem.id),
          },
        ]
      );
    } else {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  const handleIncrement = (cartItem) => {
    if (cartItem.quantity < MAX_ITEM_QUANTITY) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

  const handleRemove = (cartItem) => {
    removeFromCart(cartItem.id);
  };

  const handleClearAll = () => {
    if (cartItems.length === 0) return;
    Alert.alert(
      'Clear Order',
      'Are you sure you want to remove all items from your order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  // Navigate to checkout with validation check
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Order', 'Please add at least one canteen item to proceed.');
      return;
    }
    navigation.navigate('Checkout');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title="Your Canteen Order"
        subtitle={`${itemCount} items selected`}
        showBack
        showCart={false}
        navigation={navigation}
      />

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyBadge}>
            <Text style={styles.emptyBadgeText}>0 ITEMS</Text>
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse the University of Kelaniya canteen menu to pre-order meals and skip the queue.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.browseButtonText}>Browse Menu Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          {/* Order Header Actions */}
          <View style={styles.actionHeader}>
            <Text style={styles.itemsSummaryText}>
              Review your items before checkout
            </Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Items List */}
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item: cartItem }) => {
              const lineTotal = cartItem.item.price * cartItem.quantity;

              return (
                <View style={styles.cartCard}>
                  <View style={styles.cartCardTop}>
                    <View style={styles.itemTitleContainer}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {cartItem.item.name}
                      </Text>
                      <Badge
                        label={cartItem.item.counter}
                        variant="primary"
                        size="small"
                        style={styles.counterBadge}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => handleRemove(cartItem)}
                      style={styles.removeButton}
                      accessibilityLabel="Remove item"
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>

                  {cartItem.notes ? (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Note for kitchen:</Text>
                      <Text style={styles.notesText}>{cartItem.notes}</Text>
                    </View>
                  ) : null}

                  <View style={styles.cartCardBottom}>
                    <View style={styles.priceBreakdown}>
                      <Text style={styles.unitPriceText}>
                        {formatLKR(cartItem.item.price)} each
                      </Text>
                      <Text style={styles.lineTotalText}>
                        Total: {formatLKR(lineTotal)}
                      </Text>
                    </View>

                    <QuantitySelector
                      quantity={cartItem.quantity}
                      onIncrement={() => handleIncrement(cartItem)}
                      onDecrement={() => handleDecrement(cartItem)}
                      min={MIN_ITEM_QUANTITY}
                      max={MAX_ITEM_QUANTITY}
                      size="small"
                    />
                  </View>
                </View>
              );
            }}
            ListFooterComponent={
              <View style={styles.footerSection}>
                {/* Takeaway / Dine In Selector */}
                <View style={styles.orderTypeCard}>
                  <View style={styles.orderTypeInfo}>
                    <Text style={styles.orderTypeTitle}>Order Packaging Type</Text>
                    <Text style={styles.orderTypeDescription}>
                      {isTakeaway
                        ? 'Takeaway Box (+LKR 20 eco-friendly packaging)'
                        : 'Dine-In Plate (Served in canteen dining hall)'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      isTakeaway ? styles.toggleTakeaway : styles.toggleDineIn,
                    ]}
                    onPress={toggleTakeaway}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.toggleButtonText,
                        isTakeaway
                          ? styles.toggleTextTakeaway
                          : styles.toggleTextDineIn,
                      ]}
                    >
                      {isTakeaway ? 'Takeaway' : 'Dine In'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Subsidized Bill Breakdown */}
                <View style={styles.billCard}>
                  <Text style={styles.billTitle}>Bill Breakdown (LKR)</Text>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>
                      Items Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                    </Text>
                    <Text style={styles.billValue}>{formatLKR(subtotal)}</Text>
                  </View>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>
                      Takeaway Container Fee
                    </Text>
                    <Text style={styles.billValue}>
                      {packagingFee > 0 ? formatLKR(packagingFee) : 'LKR 0.00 (Dine-in)'}
                    </Text>
                  </View>

                  <View style={styles.billDivider} />

                  <View style={styles.billRowGrand}>
                    <Text style={styles.grandTotalLabel}>Grand Total</Text>
                    <Text style={styles.grandTotalValue}>
                      {formatLKR(grandTotal)}
                    </Text>
                  </View>

                  <View style={styles.subsidyBadge}>
                    <Text style={styles.subsidyBadgeText}>
                      University Welfare Subsidized Rates Included
                    </Text>
                  </View>
                </View>
              </View>
            }
          />

          {/* Sticky Checkout Button Bar */}
          <View style={styles.checkoutBar}>
            <View style={styles.checkoutPriceContainer}>
              <Text style={styles.checkoutLabel}>Total to Pay</Text>
              <Text style={styles.checkoutAmount}>{formatLKR(grandTotal)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleProceedToCheckout}
              activeOpacity={0.85}
              accessibilityLabel="Proceed to University Checkout"
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemsSummaryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  clearAllText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    fontWeight: FONTS.weights.bold,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 110,
  },
  cartCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  cartCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitleContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  itemName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  counterBadge: {
    marginTop: 2,
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    fontWeight: FONTS.weights.semibold,
  },
  notesContainer: {
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.sm,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primaryLight,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  notesText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cartCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  priceBreakdown: {
    justifyContent: 'center',
  },
  unitPriceText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  lineTotalText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  footerSection: {
    marginTop: SPACING.md,
  },
  orderTypeCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  orderTypeInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  orderTypeTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  orderTypeDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  toggleTakeaway: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  toggleDineIn: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.borderDark,
  },
  toggleButtonText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  toggleTextTakeaway: {
    color: COLORS.primary,
  },
  toggleTextDineIn: {
    color: COLORS.textSecondary,
  },
  billCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  billTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  billLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  billValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },
  billDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  billRowGrand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  grandTotalLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  grandTotalValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  subsidyBadge: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primaryMuted,
    padding: SPACING.xs,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  subsidyBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  emptyBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textMuted,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.lg,
  },
  browseButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  checkoutBar: {
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
  checkoutPriceContainer: {
    justifyContent: 'center',
  },
  checkoutLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  checkoutAmount: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
});
