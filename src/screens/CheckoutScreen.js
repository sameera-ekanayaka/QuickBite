import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import {
  PICKUP_COUNTERS,
  PICKUP_TIME_SLOTS,
  CANTEEN_INFO,
} from '../constants/canteenData';
import { formatLKR, validatePhone } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Badge from '../components/Badge';

const PAYMENT_METHODS = [
  { id: 'pass', name: 'Student Canteen Pass', desc: 'Deduct from student card balance' },
  { id: 'lankaqr', name: 'LankaQR / Online', desc: 'Scan QR at counter or mobile banking' },
  { id: 'cash', name: 'Cash at Counter', desc: 'Pay physical cash upon collecting meal' },
];

// Checkout Screen for QuickBite campus food ordering app.
// Enforces mandatory counter selection, pickup slot verification,
// contact number validation, and generates the new order.
export default function CheckoutScreen({ navigation }) {
  const { cartItems, subtotal, packagingFee, grandTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { currentUser } = useAuth();

  const [selectedCounter, setSelectedCounter] = useState(PICKUP_COUNTERS[0].id);
  const [selectedSlot, setSelectedSlot] = useState(PICKUP_TIME_SLOTS[0].id);
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '0714589231');
  const [selectedPayment, setSelectedPayment] = useState('pass');
  const [phoneError, setPhoneError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate all fields before placing the order
  const handlePlaceOrder = () => {
    setPhoneError('');
    setGeneralError('');

    // Guard against empty cart
    if (!cartItems || cartItems.length === 0) {
      setGeneralError('Your cart is empty. Please add menu items first.');
      return;
    }

    // Validate pickup counter selection
    if (!selectedCounter) {
      setGeneralError('Please select a designated canteen pickup counter.');
      return;
    }

    // Validate pickup time slot selection
    if (!selectedSlot) {
      setGeneralError('Please select a pickup time slot or lecture interval.');
      return;
    }

    // Validate Sri Lankan phone number format
    const phoneCheck = validatePhone(contactPhone);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.message);
      return;
    }

    // Validate payment method
    if (!selectedPayment) {
      setGeneralError('Please choose a payment method.');
      return;
    }

    setIsSubmitting(true);

    const counterObj = PICKUP_COUNTERS.find((c) => c.id === selectedCounter);
    const slotObj = PICKUP_TIME_SLOTS.find((s) => s.id === selectedSlot);
    const paymentObj = PAYMENT_METHODS.find((p) => p.id === selectedPayment);

    // Call order creation logic from context
    const result = placeOrder({
      items: cartItems,
      subtotal,
      packagingFee,
      grandTotal,
      pickupCounter: counterObj?.name || 'Counter 1',
      pickupTimeSlot: slotObj?.label || 'Next Lecture Interval',
      contactPhone: contactPhone.trim(),
      paymentMethod: paymentObj?.name || 'Cash at Counter',
      studentInfo: currentUser,
    });

    if (result.success) {
      // Clear cart upon successful order creation
      clearCart();
      setIsSubmitting(false);

      // Navigate directly to live tracking screen
      navigation.replace('OrderTracking', { orderId: result.order.id });
    } else {
      setIsSubmitting(false);
      setGeneralError(result.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title="Canteen Checkout"
        subtitle={CANTEEN_INFO.name}
        showBack
        showCart={false}
        navigation={navigation}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Error Notification Banner */}
        {generalError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{generalError}</Text>
          </View>
        ) : null}

        {/* Student Credential Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ordering Student Details</Text>
          <View style={styles.studentInfoBox}>
            <Text style={styles.studentName}>
              {currentUser?.name || 'Student'}
            </Text>
            <Text style={styles.studentReg}>
              ID: {currentUser?.studentId || 'PS/2021/045'} - {currentUser?.faculty || 'Faculty of Science'}
            </Text>
            <Text style={styles.studentEmail}>
              {currentUser?.email || 'ps2021045@stu.kln.ac.lk'}
            </Text>
          </View>
        </View>

        {/* Step 1: Mandatory Pickup Counter Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Select Canteen Pickup Counter</Text>
          <Text style={styles.sectionSubtitle}>
            Collect your meal from the assigned station to avoid congestion
          </Text>

          {PICKUP_COUNTERS.map((counter) => {
            const isSelected = selectedCounter === counter.id;
            return (
              <TouchableOpacity
                key={counter.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedCounter(counter.id)}
                activeOpacity={0.8}
              >
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.optionDetails}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isSelected && styles.optionTitleSelected,
                    ]}
                  >
                    {counter.name}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {counter.description}
                  </Text>
                  <Text style={styles.optionLocation}>
                    Location: {counter.location}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 2: Mandatory Pickup Time Slot Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Choose Pickup Time Slot</Text>
          <Text style={styles.sectionSubtitle}>
            Timed to your University of Kelaniya lecture timetable
          </Text>

          {PICKUP_TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedSlot(slot.id)}
                activeOpacity={0.8}
              >
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.optionDetails}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isSelected && styles.optionTitleSelected,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 3: Contact Number for Order SMS Alert */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Contact Phone Number</Text>
          <Text style={styles.sectionSubtitle}>
            Required for SMS notification when order is ready at the counter
          </Text>

          <TextInput
            style={[styles.phoneInput, phoneError ? styles.phoneInputError : null]}
            placeholder="e.g. 0714589231 or +94714589231"
            placeholderTextColor={COLORS.textMuted}
            value={contactPhone}
            onChangeText={(text) => {
              setContactPhone(text);
              if (phoneError) setPhoneError('');
            }}
            keyboardType="phone-pad"
          />
          {phoneError ? (
            <Text style={styles.fieldErrorText}>{phoneError}</Text>
          ) : (
            <Text style={styles.inputHint}>
              Sri Lankan mobile format (07XXXXXXXX or +947XXXXXXXX)
            </Text>
          )}
        </View>

        {/* Step 4: Payment Method Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Payment Method</Text>

          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedPayment === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedPayment(method.id)}
                activeOpacity={0.8}
              >
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.optionDetails}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isSelected && styles.optionTitleSelected,
                    ]}
                  >
                    {method.name}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {method.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Summary Confirmation Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((ci) => (
            <View key={ci.id} style={styles.summaryItemRow}>
              <Text style={styles.summaryItemText}>
                {ci.quantity}x {ci.item.name}
              </Text>
              <Text style={styles.summaryItemPrice}>
                {formatLKR(ci.item.price * ci.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItemRow}>
            <Text style={styles.summaryMutedText}>Subtotal</Text>
            <Text style={styles.summaryMutedText}>{formatLKR(subtotal)}</Text>
          </View>
          <View style={styles.summaryItemRow}>
            <Text style={styles.summaryMutedText}>Packaging Fee</Text>
            <Text style={styles.summaryMutedText}>
              {packagingFee > 0 ? formatLKR(packagingFee) : 'LKR 0.00'}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryGrandRow}>
            <Text style={styles.summaryGrandLabel}>Amount Due (LKR)</Text>
            <Text style={styles.summaryGrandValue}>{formatLKR(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Place Order Bar */}
      <View style={styles.placeOrderBar}>
        <View style={styles.placeOrderPriceSection}>
          <Text style={styles.placeOrderLabel}>Grand Total</Text>
          <Text style={styles.placeOrderAmount}>{formatLKR(grandTotal)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderButton, isSubmitting && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
          activeOpacity={0.85}
          accessibilityLabel="Confirm and place canteen order"
        >
          <Text style={styles.placeOrderButtonText}>
            {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
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
  errorBanner: {
    backgroundColor: COLORS.dangerLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  studentInfoBox: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginTop: 4,
  },
  studentName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  studentReg: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  studentEmail: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: SPACING.sm,
  },
  optionCardSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optionDetails: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  optionTitleSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
  optionDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionLocation: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  phoneInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  phoneInputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  fieldErrorText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: FONTS.weights.medium,
  },
  inputHint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryItemText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  summaryItemPrice: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  summaryMutedText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  summaryGrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  summaryGrandLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  summaryGrandValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  placeOrderBar: {
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
  placeOrderPriceSection: {
    justifyContent: 'center',
  },
  placeOrderLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  placeOrderAmount: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
  },
  placeOrderButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  placeOrderButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
});
