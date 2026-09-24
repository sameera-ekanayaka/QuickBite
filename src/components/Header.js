import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { useCart } from '../context/CartContext';

// Uber-Inspired Top Navigation Bar.
// Restrained black-and-white header with pill navigation controls
// and geometric brand monogram.
export default function Header({
  title = 'QuickBite',
  subtitle = 'University of Kelaniya Canteen',
  showBack = false,
  showCart = true,
  showProfile = true,
  onBack,
  navigation,
}) {
  const { itemCount } = useCart();

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleCartPress = () => {
    if (navigation) {
      navigation.navigate('Cart');
    }
  };

  const handleProfilePress = () => {
    if (navigation) {
      navigation.navigate('Profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backPill}
            onPress={handleBackPress}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <Text style={styles.backPillText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.brandMonogram}>
            <Text style={styles.brandMonogramText}>QB</Text>
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightSection}>
        {showCart && (
          <TouchableOpacity
            style={[styles.cartPill, itemCount > 0 && styles.cartPillActive]}
            onPress={handleCartPress}
            activeOpacity={0.8}
            accessibilityLabel="Open Cart"
          >
            <Text
              style={[
                styles.cartPillLabel,
                itemCount > 0 && styles.cartPillLabelActive,
              ]}
            >
              Cart
            </Text>
            {itemCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>
                  {itemCount > 99 ? '99+' : itemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity
            style={styles.profilePill}
            onPress={handleProfilePress}
            activeOpacity={0.8}
            accessibilityLabel="Open Profile"
          >
            <Text style={styles.profilePillText}>Account</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.canvas,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandMonogram: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary, // Solid black
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  brandMonogramText: {
    color: COLORS.onPrimary,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 0.5,
  },
  backPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.pill, // 999px pill
    marginRight: SPACING.md,
  },
  backPillText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.ink,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.pill, // 999px pill
  },
  cartPillActive: {
    backgroundColor: COLORS.primary, // Polarity flip to black on active cart
  },
  cartPillLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.ink,
  },
  cartPillLabelActive: {
    color: COLORS.onPrimary,
  },
  badgeCount: {
    backgroundColor: COLORS.onPrimary,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
  },
  profilePill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.pill, // 999px pill
  },
  profilePillText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.ink,
  },
});
