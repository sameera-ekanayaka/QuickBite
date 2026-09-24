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

const PAYMENT_METHODS = [
  { id: 'pass', name: 'Student Canteen Pass', desc: 'Deduct from student card balance' },
  { id: 'lankaqr', name: 'LankaQR / Online', desc: 'Scan QR at counter or mobile banking' },
  { id: 'cash', name: 'Cash at Counter', desc: 'Pay physical cash upon collecting meal' },
];

// Uber-Inspired Checkout Screen.
// Structured in 16px request-form cards, canvas-soft input rows,
// and a signature 999px black pill confirmation button.
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

  const handlePlaceOrder = () => {
    setPhoneError('');
    setGeneralError('');

    if (!cartItems || cartItems.length === 0) {
      setGeneralError('Your cart is empty. Please add menu items first.');
      return;
    }

    if (!selectedCounter) {
      setGeneralError('Please select a designated canteen pickup counter.');
      return;
    }

    if (!selectedSlot) {
      setGeneralError('Please select a pickup time slot or lecture interval.');
      return;
    }

    const phoneCheck = validatePhone(contactPhone);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.message);
      return;
    }

    if (!selectedPayment) {
      setGeneralError('Please choose a payment method.');
      return;
    }

    setIsSubmitting(true);

    const counterObj = PICKUP_COUNTERS.find((c) => c.id === selectedCounter);
    const slotObj = PICKUP_TIME_SLOTS.find((s) => s.id === selectedSlot);
    const paymentObj = PAYMENT_METHODS.find((p) => p.id === selectedPayment);

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
      clearCart();
      setIsSubmitting(false);
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
        title="Checkout"
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
        {generalError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{generalError}</Text>
          </View>
        ) : null}

        {/* Student Details Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Student details</Text>
          <View style={styles.studentInfoBox}>
            <Text style={styles.studentName}>
              {currentUser?.name || 'Student'}
            </Text>
            <Text style={styles.studentReg}>
              {currentUser?.studentId || 'PS/2021/045'} • {currentUser?.faculty || 'Faculty of Science'}
            </Text>
            <Text style={styles.studentEmail}>
              {currentUser?.email || 'ps2021045@stu.kln.ac.lk'}
            </Text>
          </View>
        </View>

        {/* 1. Pickup Counter Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Select pickup counter</Text>
          <Text style={styles.sectionSubtitle}>
            Collect your meal from the designated station
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

        {/* 2. Pickup Time Slot */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Choose pickup time slot</Text>
          <Text style={styles.sectionSubtitle}>
            Timed to your lecture interval
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

        {/* 3. Contact Phone Input */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Contact phone number</Text>
          <Text style={styles.sectionSubtitle}>
            Required for SMS alert when order is ready
          </Text>

          <TextInput
            style={[styles.phoneInputRow, phoneError ? styles.phoneInputRowError : null]}
            placeholder="e.g. 0714589231 or +94714589231"
            placeholderTextColor={COLORS.mute}
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

        {/* 4. Payment Method */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Payment method</Text>

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
          <Text style={styles.sectionTitle}>Order summary</Text>
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
            <Text style={styles.summaryMutedText}>Packaging fee</Text>
            <Text style={styles.summaryMutedText}>
              {packagingFee > 0 ? formatLKR(packagingFee) : 'LKR 0.00'}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryGrandRow}>
            <Text style={styles.summaryGrandLabel}>Amount due (LKR)</Text>
            <Text style={styles.summaryGrandValue}>{formatLKR(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Place Order Bar */}
      <View style={styles.placeOrderBar}>
        <View>
          <Text style={styles.placeOrderLabel}>Grand total</Text>
          <Text style={styles.placeOrderAmount}>{formatLKR(grandTotal)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderPill, isSubmitting && styles.placeOrderPillDisabled]}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
          activeOpacity={0.85}
          accessibilityLabel="Confirm and place canteen order"
        >
          <Text style={styles.placeOrderPillText}>
            {isSubmitting ? 'Placing order...' : 'Confirm & place order'}
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
  errorBanner: {
    backgroundColor: COLORS.dangerLight,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },
  sectionCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl, // 16px
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
    marginBottom: SPACING.md,
  },
  studentInfoBox: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: 4,
  },
  studentName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  studentReg: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
    marginTop: 2,
  },
  studentEmail: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
    marginTop: 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  optionCardSelected: {
    borderColor: COLORS.ink,
    backgroundColor: COLORS.canvasSoft,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.ink,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.ink,
  },
  optionDetails: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.ink,
  },
  optionTitleSelected: {
    fontWeight: FONTS.weights.bold,
  },
  optionDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
    marginTop: 2,
  },
  optionLocation: {
    fontSize: 10,
    color: COLORS.mute,
    marginTop: 2,
  },
  phoneInputRow: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.md, // 8px
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.sm,
    color: COLORS.ink,
    marginTop: 4,
  },
  phoneInputRowError: {
    borderWidth: 1,
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
    color: COLORS.mute,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryItemText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.ink,
    flex: 1,
    marginRight: SPACING.sm,
  },
  summaryItemPrice: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.ink,
  },
  summaryMutedText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
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
    color: COLORS.ink,
  },
  summaryGrandValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  placeOrderBar: {
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
  placeOrderLabel: {
    fontSize: 10,
    color: COLORS.mute,
    textTransform: 'uppercase',
  },
  placeOrderAmount: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  placeOrderPill: {
    backgroundColor: COLORS.primary, // Signature 999px black pill
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
  },
  placeOrderPillDisabled: {
    backgroundColor: COLORS.disabled,
  },
  placeOrderPillText: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
});
