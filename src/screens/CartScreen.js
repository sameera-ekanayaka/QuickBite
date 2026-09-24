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
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { formatLKR } from '../utils/formatters';
import { useCart, MIN_ITEM_QUANTITY, MAX_ITEM_QUANTITY } from '../context/CartContext';
import Header from '../components/Header';
import QuantitySelector from '../components/QuantitySelector';
import Badge from '../components/Badge';

// Uber-Inspired Cart Screen.
// Designed with 16px line-item cards, pill toggles,
// and canonical 999px black pill checkout CTA.
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

  const handleDecrement = (cartItem) => {
    if (cartItem.quantity <= 1) {
      Alert.alert(
        'Remove item',
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
      'Clear order',
      'Are you sure you want to remove all items from your order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear all', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty order', 'Please add at least one canteen item to proceed.');
      return;
    }
    navigation.navigate('Checkout');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title="Your order"
        subtitle={`${itemCount} items`}
        showBack
        showCart={false}
        navigation={navigation}
      />

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyPillBadge}>
            <Text style={styles.emptyPillText}>0 items</Text>
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items from the University of Kelaniya canteen menu to pre-order and skip the queue.
          </Text>
          <TouchableOpacity
            style={styles.browsePill}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.browsePillText}>Browse menu items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          {/* Top Actions */}
          <View style={styles.actionHeader}>
            <Text style={styles.itemsSummaryText}>
              Review your items before checkout
            </Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          </View>

          {/* Cart List */}
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
                        variant="outline"
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
                    <View>
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
                    <Text style={styles.orderTypeTitle}>Packaging preference</Text>
                    <Text style={styles.orderTypeDescription}>
                      {isTakeaway
                        ? 'Takeaway box (+LKR 20 eco-friendly packaging)'
                        : 'Dine-in plate (Canteen dining hall)'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.togglePill,
                      isTakeaway ? styles.togglePillTakeaway : styles.togglePillDineIn,
                    ]}
                    onPress={toggleTakeaway}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.togglePillText,
                        isTakeaway
                          ? styles.toggleTextTakeaway
                          : styles.toggleTextDineIn,
                      ]}
                    >
                      {isTakeaway ? 'Takeaway' : 'Dine in'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Subsidized Bill Breakdown */}
                <View style={styles.billCard}>
                  <Text style={styles.billTitle}>Bill breakdown (LKR)</Text>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>
                      Items subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                    </Text>
                    <Text style={styles.billValue}>{formatLKR(subtotal)}</Text>
                  </View>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>
                      Takeaway packaging fee
                    </Text>
                    <Text style={styles.billValue}>
                      {packagingFee > 0 ? formatLKR(packagingFee) : 'LKR 0.00 (Dine-in)'}
                    </Text>
                  </View>

                  <View style={styles.billDivider} />

                  <View style={styles.billRowGrand}>
                    <Text style={styles.grandTotalLabel}>Grand total</Text>
                    <Text style={styles.grandTotalValue}>
                      {formatLKR(grandTotal)}
                    </Text>
                  </View>

                  <View style={styles.subsidyNotice}>
                    <Text style={styles.subsidyNoticeText}>
                      University student subsidized rates included
                    </Text>
                  </View>
                </View>
              </View>
            }
          />

          {/* Sticky Checkout Pill Bar */}
          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.checkoutLabel}>Total to pay</Text>
              <Text style={styles.checkoutAmount}>{formatLKR(grandTotal)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutPill}
              onPress={handleProceedToCheckout}
              activeOpacity={0.85}
              accessibilityLabel="Proceed to checkout"
            >
              <Text style={styles.checkoutPillText}>Proceed to checkout</Text>
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
    backgroundColor: COLORS.canvas,
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
    backgroundColor: COLORS.canvas,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemsSummaryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
  },
  clearAllText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    fontWeight: FONTS.weights.semibold,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 110,
  },
  cartCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl, // 16px
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.ink,
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
    color: COLORS.mute,
    fontWeight: FONTS.weights.medium,
  },
  notesContainer: {
    backgroundColor: COLORS.canvasSoft,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
    color: COLORS.mute,
    textTransform: 'uppercase',
  },
  notesText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
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
  unitPriceText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
  },
  lineTotalText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  footerSection: {
    marginTop: SPACING.md,
  },
  orderTypeCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  orderTypeInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  orderTypeTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  orderTypeDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
    marginTop: 2,
  },
  togglePill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill, // 999px pill
  },
  togglePillTakeaway: {
    backgroundColor: COLORS.primary, // Black
  },
  togglePillDineIn: {
    backgroundColor: COLORS.canvasSoft,
  },
  togglePillText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  toggleTextTakeaway: {
    color: COLORS.onPrimary,
  },
  toggleTextDineIn: {
    color: COLORS.ink,
  },
  billCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  billTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  billLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
  },
  billValue: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.ink,
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
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  grandTotalValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  subsidyNotice: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.canvasSoft,
    padding: SPACING.xs,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
  },
  subsidyNoticeText: {
    fontSize: 10,
    color: COLORS.body,
    fontWeight: FONTS.weights.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyPillBadge: {
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    marginBottom: SPACING.md,
  },
  emptyPillText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.mute,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  browsePill: {
    backgroundColor: COLORS.primary, // Black pill
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.pill, // 999px pill
  },
  browsePillText: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  checkoutBar: {
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
  checkoutLabel: {
    fontSize: 10,
    color: COLORS.mute,
    textTransform: 'uppercase',
  },
  checkoutAmount: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  checkoutPill: {
    backgroundColor: COLORS.primary, // Signature 999px black pill
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
  },
  checkoutPillText: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
});
