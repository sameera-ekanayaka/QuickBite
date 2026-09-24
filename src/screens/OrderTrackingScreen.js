import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { formatLKR } from '../utils/formatters';
import { useOrders, ORDER_STATUSES } from '../context/OrderContext';
import Header from '../components/Header';
import Badge from '../components/Badge';
import StatusTracker from '../components/StatusTracker';

// Order Confirmation and Live Status Tracking Screen.
// Fulfills Activity Sheet Requirements 4, 11:
// - Displays generated order number and estimated pickup time.
// - Provides multi-stage progression: Placed -> Preparing -> Ready for pickup -> Completed.
// - Features interactive simulation button to cycle through status states in real time.
export default function OrderTrackingScreen({ route, navigation }) {
  const { activeOrders, currentOrder, advanceOrderStatus, orderHistory } = useOrders();

  // Find order by param ID, or fall back to currentOrder, or most recent order
  const orderId = route.params?.orderId;
  const activeOrder =
    (orderId ? activeOrders.find((o) => o.id === orderId) : null) ||
    currentOrder ||
    activeOrders[0] ||
    orderHistory[0];

  // If no order exists at all
  if (!activeOrder) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Order Status" showBack navigation={navigation} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Active Order Found</Text>
          <Text style={styles.emptySubtitle}>
            Place a canteen order from the menu to track preparation status.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Go to Canteen Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = activeOrder.status === 'Completed';
  const statusIndex = ORDER_STATUSES.indexOf(activeOrder.status);
  const nextStatus =
    statusIndex < ORDER_STATUSES.length - 1
      ? ORDER_STATUSES[statusIndex + 1]
      : null;

  // Advance order status simulating kitchen lifecycle
  const handleSimulateStatus = () => {
    if (activeOrder.id) {
      advanceOrderStatus(activeOrder.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title="Order Tracking"
        subtitle={`Order ${activeOrder.id}`}
        showBack
        navigation={navigation}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Confirmation Card */}
        <View style={styles.confirmationCard}>
          <View style={styles.confirmationHeader}>
            <View>
              <Text style={styles.orderLabel}>University of Kelaniya Canteen</Text>
              <Text style={styles.orderIdText}>{activeOrder.id}</Text>
            </View>
            <Badge
              label={activeOrder.status}
              variant={isCompleted ? 'success' : 'primary'}
            />
          </View>

          <View style={styles.ticketDetails}>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Pickup Counter:</Text>
              <Text style={styles.ticketValue}>{activeOrder.counter}</Text>
            </View>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Pickup Interval:</Text>
              <Text style={styles.ticketValue}>{activeOrder.pickupTimeSlot}</Text>
            </View>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Estimated Ready:</Text>
              <Text style={styles.ticketValueHighlight}>Within 10-15 Minutes</Text>
            </View>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Student Recipient:</Text>
              <Text style={styles.ticketValue}>
                {activeOrder.studentName} ({activeOrder.studentId})
              </Text>
            </View>
          </View>

          {/* Counter Pickup Verification Code */}
          <View style={styles.verificationBox}>
            <Text style={styles.verificationLabel}>Counter Pickup Token</Text>
            <Text style={styles.verificationToken}>
              {activeOrder.id.replace('UOK-', '')}
            </Text>
            <Text style={styles.verificationHint}>
              Present this token or your student ID at {activeOrder.counter}
            </Text>
          </View>
        </View>

        {/* Visual Lifecycle Pipeline Component */}
        <StatusTracker currentStatus={activeOrder.status} />

        {/* Simulation Controls for Evaluators */}
        <View style={styles.simulationCard}>
          <Text style={styles.simulationTitle}>Status Lifecycle Simulation</Text>
          <Text style={styles.simulationDescription}>
            This control simulates kitchen meal preparation and packaging updates as required by the activity tasks.
          </Text>

          {nextStatus ? (
            <TouchableOpacity
              style={styles.simulateButton}
              onPress={handleSimulateStatus}
              activeOpacity={0.85}
              accessibilityLabel={`Advance status to ${nextStatus}`}
            >
              <Text style={styles.simulateButtonText}>
                Simulate Transition: Move to "{nextStatus}"
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedNotice}>
              <Text style={styles.completedNoticeText}>
                Order has reached the final Completed state and is saved in your Order History.
              </Text>
            </View>
          )}
        </View>

        {/* Ordered Food Items Breakdown */}
        <View style={styles.itemsCard}>
          <Text style={styles.itemsCardTitle}>Order Items Receipt</Text>
          {activeOrder.items?.map((item, index) => (
            <View key={`${item.id || item.name}-${index}`} style={styles.itemReceiptRow}>
              <View style={styles.itemReceiptDetails}>
                <Text style={styles.itemReceiptName}>
                  {item.quantity}x {item.name}
                </Text>
                {item.notes ? (
                  <Text style={styles.itemReceiptNotes}>Note: {item.notes}</Text>
                ) : null}
              </View>
              <Text style={styles.itemReceiptPrice}>
                {formatLKR(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptMuted}>Packaging Container Fee</Text>
            <Text style={styles.receiptMuted}>
              {activeOrder.packagingFee > 0
                ? formatLKR(activeOrder.packagingFee)
                : 'LKR 0.00'}
            </Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptMuted}>Payment Method</Text>
            <Text style={styles.receiptMuted}>{activeOrder.paymentMethod}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptGrandRow}>
            <Text style={styles.receiptGrandLabel}>Total Paid (LKR)</Text>
            <Text style={styles.receiptGrandValue}>
              {formatLKR(activeOrder.grandTotal)}
            </Text>
          </View>
        </View>

        {/* Navigation Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.homeButtonText}>Return to Canteen Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.85}
          >
            <Text style={styles.profileButtonText}>View Order in Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: SPACING.huge,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
  },
  browseButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  confirmationCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  confirmationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
  },
  orderLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  orderIdText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginTop: 2,
  },
  ticketDetails: {
    gap: 8,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  ticketValue: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  ticketValueHighlight: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.success,
  },
  verificationBox: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  verificationLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
    textTransform: 'uppercase',
  },
  verificationToken: {
    fontSize: 32,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    letterSpacing: 4,
    marginVertical: 4,
  },
  verificationHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  simulationCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  simulationTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.accent,
    marginBottom: 4,
  },
  simulationDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  simulateButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  simulateButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  completedNotice: {
    backgroundColor: COLORS.successLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  completedNoticeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
  },
  itemsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  itemsCardTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  itemReceiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  itemReceiptDetails: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  itemReceiptName: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  itemReceiptNotes: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 1,
  },
  itemReceiptPrice: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  receiptMuted: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  receiptGrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  receiptGrandLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  receiptGrandValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  actionButtons: {
    gap: SPACING.sm,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  homeButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  profileButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  profileButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
});
