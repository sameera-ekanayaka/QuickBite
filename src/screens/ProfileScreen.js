import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { formatLKR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import Header from '../components/Header';
import Badge from '../components/Badge';

// User Profile Screen for QuickBite campus food ordering app.
// Displays student identification credentials, campus canteen pass balance,
// and chronological history of past orders.
export default function ProfileScreen({ navigation }) {
  const { currentUser, logout, isGuest } = useAuth();
  const { orderHistory, activeOrders } = useOrders();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from QuickBite?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const allOrders = [...activeOrders, ...orderHistory];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title="Student Profile"
        subtitle="University of Kelaniya"
        showBack
        showProfile={false}
        navigation={navigation}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Credential ID Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()
                  : 'ST'}
              </Text>
            </View>

            <View style={styles.profileMeta}>
              <Text style={styles.studentName}>
                {currentUser?.name || 'Sameera Ekanayaka'}
              </Text>
              <Text style={styles.studentRegId}>
                Reg No: {currentUser?.studentId || 'PS/2021/045'}
              </Text>
              <Badge
                label={isGuest ? 'Guest Access' : 'Verified Undergraduate'}
                variant={isGuest ? 'warning' : 'success'}
                size="small"
                style={styles.studentBadge}
              />
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>University</Text>
              <Text style={styles.detailValue}>
                {currentUser?.university || 'University of Kelaniya'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Faculty</Text>
              <Text style={styles.detailValue}>
                {currentUser?.faculty || 'Faculty of Science'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Official Email</Text>
              <Text style={styles.detailValue}>
                {currentUser?.email || 'ps2021045@stu.kln.ac.lk'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Alert Phone</Text>
              <Text style={styles.detailValue}>
                {currentUser?.phone || '0714589231'}
              </Text>
            </View>
          </View>
        </View>

        {/* Student Canteen Pass Balance */}
        <View style={styles.passCard}>
          <View style={styles.passHeader}>
            <View>
              <Text style={styles.passLabel}>Student Canteen Pass</Text>
              <Text style={styles.passBalance}>
                {formatLKR(currentUser?.canteenPassBalance || 1250)}
              </Text>
            </View>
            <View style={styles.passPill}>
              <Text style={styles.passPillText}>Active Balance</Text>
            </View>
          </View>
          <Text style={styles.passNotice}>
            Usable at University of Kelaniya Main Canteen, Science Faculty Canteen, and Kannangara Canteen counters.
          </Text>
        </View>

        {/* Order History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>
            Past Order History ({allOrders.length})
          </Text>

          {allOrders.length === 0 ? (
            <View style={styles.emptyHistoryCard}>
              <Text style={styles.emptyHistoryText}>
                No past orders recorded yet. Pre-order meals from the menu.
              </Text>
            </View>
          ) : (
            allOrders.map((order) => {
              const isOrderCompleted = order.status === 'Completed';

              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderCardHeader}>
                    <View>
                      <Text style={styles.orderCardId}>{order.id}</Text>
                      <Text style={styles.orderCardDate}>{order.date}</Text>
                    </View>
                    <Badge
                      label={order.status}
                      variant={isOrderCompleted ? 'success' : 'primary'}
                      size="small"
                    />
                  </View>

                  <View style={styles.orderItemsList}>
                    {order.items?.map((item, idx) => (
                      <Text
                        key={`${item.name}-${idx}`}
                        style={styles.orderItemRow}
                        numberOfLines={1}
                      >
                        - {item.quantity}x {item.name} ({formatLKR(item.price)})
                      </Text>
                    ))}
                  </View>

                  <View style={styles.orderCardFooter}>
                    <Text style={styles.counterNote}>{order.counter}</Text>
                    <Text style={styles.orderCardTotal}>
                      Total: {formatLKR(order.grandTotal)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityLabel="Sign out of student account"
        >
          <Text style={styles.logoutButtonText}>Sign Out Account</Text>
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 1,
  },
  profileMeta: {
    flex: 1,
  },
  studentName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  studentRegId: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  studentBadge: {
    marginTop: 6,
  },
  detailsGrid: {
    gap: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  passCard: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    marginBottom: SPACING.lg,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  passLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
    textTransform: 'uppercase',
  },
  passBalance: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginTop: 2,
  },
  passPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  passPillText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
  },
  passNotice: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  historySection: {
    marginBottom: SPACING.lg,
  },
  historyTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyHistoryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyHistoryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  orderCardId: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  orderCardDate: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  orderItemsList: {
    marginVertical: 4,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  orderItemRow: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginVertical: 1,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  counterNote: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  orderCardTotal: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  logoutButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
});
