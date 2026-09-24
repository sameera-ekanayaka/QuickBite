import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { CANTEEN_INFO } from '../constants/canteenData';

// Splash Screen for QuickBite campus food ordering app.
// Displays University of Kelaniya branding and canteen slogan.
// Automatically transitions to Login screen or allows manual advance.
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Automated timer transition (2 seconds) as per smooth navigation requirements
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleManualProceed = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoInitial}>QB</Text>
          </View>
          <Text style={styles.appName}>QuickBite</Text>
          <Text style={styles.institutionName}>University of Kelaniya</Text>
          <View style={styles.sloganContainer}>
            <Text style={styles.sloganText}>
              Skip the canteen queue between lectures
            </Text>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.canteenTitle}>{CANTEEN_INFO.name}</Text>
          <Text style={styles.canteenLocation}>{CANTEEN_INFO.location}</Text>
          <Text style={styles.canteenHours}>
            Daily Service: {CANTEEN_INFO.operatingHours}
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>Subsidized Student Prices</Text>
            </View>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>Express Counter Pickup</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleManualProceed}
            activeOpacity={0.85}
            accessibilityLabel="Proceed to Canteen Login"
          >
            <Text style={styles.proceedButtonText}>Enter Canteen</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>Version 1.0.0 (MVP) - Dalugama Campus</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: SPACING.huge,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  logoInitial: {
    fontSize: 38,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  appName: {
    fontSize: 34,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  institutionName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.accentLight,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  sloganContainer: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.full,
  },
  sloganText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    textAlign: 'center',
  },
  cardInfo: {
    backgroundColor: COLORS.white,
    width: '100%',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  canteenTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  canteenLocation: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  canteenHours: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
    marginTop: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  infoPill: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  infoPillText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
  },
  footerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  proceedButton: {
    backgroundColor: COLORS.white,
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  proceedButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  versionText: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
