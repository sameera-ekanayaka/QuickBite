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
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { formatLKR } from '../utils/formatters';
import { useOrders, ORDER_STATUSES } from '../context/OrderContext';
import Header from '../components/Header';
import Badge from '../components/Badge';
import StatusTracker from '../components/StatusTracker';

// Uber-Inspired Order Confirmation & Tracking Screen.
// Clean monochromatic receipt chrome, verification token badge,
// and simulation pill controls.
export default function OrderTrackingScreen({ route, navigation }) {
  const { activeOrders, currentOrder, advanceOrderStatus, orderHistory } = useOrders();

  const orderId = route.params?.orderId;
  const activeOrder =
    (orderId ? activeOrders.find((o) => o.id === orderId) : null) ||
    currentOrder ||
    activeOrders[0] ||
    orderHistory[0];

  if (!activeOrder) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Order status" showBack navigation={navigation} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No active order found</Text>
          <Text style={styles.emptySubtitle}>
            Place a canteen order from the menu to track preparation status.
          </Text>
          <TouchableOpacity
            style={styles.browsePill}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browsePillText}>Go to canteen menu</Text>
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

  const handleSimulateStatus = () => {
    if (activeOrder.id) {
      advanceOrderStatus(activeOrder.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title="Order tracking"
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
              variant={isCompleted ? 'primary' : 'outline'}
            />
          </View>

          <View style={styles.ticketDetails}>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Pickup counter:</Text>
              <Text style={styles.ticketValue}>{activeOrder.counter}</Text>
            </View>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Pickup interval:</Text>
              <Text style={styles.ticketValue}>{activeOrder.pickupTimeSlot}</Text>
            </View>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Estimated ready:</Text>
              <Text style={styles.ticketValueHighlight}>Ready in 10-15 minutes</Text>
            </View>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>Recipient:</Text>
              <Text style={styles.ticketValue}>
                {activeOrder.studentName} ({activeOrder.studentId})
              </Text>
            </View>
          </View>

          {/* Verification Token Box */}
          <View style={styles.verificationBox}>
            <Text style={styles.verificationLabel}>Counter pickup token</Text>
            <Text style={styles.verificationToken}>
              {activeOrder.id.replace('UOK-', '')}
            </Text>
            <Text style={styles.verificationHint}>
              Show this token at {activeOrder.counter}
            </Text>
          </View>
        </View>

        {/* Status Pipeline Component */}
        <StatusTracker currentStatus={activeOrder.status} />

        {/* Simulation Controls for Evaluators */}
        <View style={styles.simulationCard}>
          <Text style={styles.simulationTitle}>Status lifecycle simulation</Text>
          <Text style={styles.simulationDescription}>
            Simulates canteen meal preparation and packaging updates as specified in the activity tasks.
          </Text>

          {nextStatus ? (
            <TouchableOpacity
              style={styles.simulatePill}
              onPress={handleSimulateStatus}
              activeOpacity={0.85}
              accessibilityLabel={`Advance status to ${nextStatus}`}
            >
              <Text style={styles.simulatePillText}>
                Advance stage: Move to "{nextStatus}"
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedNotice}>
              <Text style={styles.completedNoticeText}>
                Order has reached the final Completed state and is saved in your history.
              </Text>
            </View>
          )}
        </View>

        {/* Ordered Food Items Receipt */}
        <View style={styles.itemsCard}>
          <Text style={styles.itemsCardTitle}>Order receipt</Text>
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
            <Text style={styles.receiptMuted}>Packaging container fee</Text>
            <Text style={styles.receiptMuted}>
              {activeOrder.packagingFee > 0
                ? formatLKR(activeOrder.packagingFee)
                : 'LKR 0.00'}
            </Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptMuted}>Payment method</Text>
            <Text style={styles.receiptMuted}>{activeOrder.paymentMethod}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptGrandRow}>
            <Text style={styles.receiptGrandLabel}>Total paid</Text>
            <Text style={styles.receiptGrandValue}>
              {formatLKR(activeOrder.grandTotal)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.homePill}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.homePillText}>Return to canteen menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profilePill}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.85}
          >
            <Text style={styles.profilePillText}>View order in profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    color: COLORS.ink,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.mute,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  browsePill: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
  },
  browsePillText: {
    color: COLORS.onPrimary,
    fontWeight: FONTS.weights.bold,
  },
  confirmationCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl, // 16px
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.mute,
    textTransform: 'uppercase',
  },
  orderIdText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    marginTop: 2,
    letterSpacing: -0.5,
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
    color: COLORS.mute,
  },
  ticketValue: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.ink,
  },
  ticketValueHighlight: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  verificationBox: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  verificationLabel: {
    fontSize: 10,
    color: COLORS.mute,
    fontWeight: FONTS.weights.medium,
    textTransform: 'uppercase',
  },
  verificationToken: {
    fontSize: 34,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    letterSpacing: 4,
    marginVertical: 4,
  },
  verificationHint: {
    fontSize: 11,
    color: COLORS.body,
    textAlign: 'center',
  },
  simulationCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  simulationTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    marginBottom: 4,
  },
  simulationDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  simulatePill: {
    backgroundColor: COLORS.primary, // Black pill
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill, // 999px pill
    alignItems: 'center',
  },
  simulatePillText: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  completedNotice: {
    backgroundColor: COLORS.canvasSoft,
    padding: SPACING.md,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
  },
  completedNoticeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.ink,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
  },
  itemsCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  itemsCardTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
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
    fontWeight: FONTS.weights.medium,
    color: COLORS.ink,
  },
  itemReceiptNotes: {
    fontSize: 10,
    color: COLORS.mute,
    fontStyle: 'italic',
    marginTop: 1,
  },
  itemReceiptPrice: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
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
    color: COLORS.mute,
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
    color: COLORS.ink,
  },
  receiptGrandValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  actionButtons: {
    gap: SPACING.sm,
  },
  homePill: {
    backgroundColor: COLORS.primary, // Black pill
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill, // 999px pill
    alignItems: 'center',
  },
  homePillText: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  profilePill: {
    backgroundColor: COLORS.canvasSoft,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill, // 999px pill
    alignItems: 'center',
  },
  profilePillText: {
    color: COLORS.ink,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
});
