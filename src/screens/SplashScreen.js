import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { CANTEEN_INFO } from '../constants/canteenData';

// Uber-Inspired Splash Screen for QuickBite campus food ordering app.
// High-contrast black-and-white layout with bold display typography
// and a signature pill CTA.
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Automated timer transition as per smooth navigation requirements
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
          <View style={styles.monogram}>
            <Text style={styles.monogramText}>QB</Text>
          </View>
          <Text style={styles.appName}>QuickBite</Text>
          <Text style={styles.institutionName}>University of Kelaniya</Text>
          <Text style={styles.headline}>
            Skip the canteen queue between lectures.
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.canteenTitle}>{CANTEEN_INFO.name}</Text>
          <Text style={styles.canteenLocation}>{CANTEEN_INFO.location}</Text>
          <Text style={styles.canteenHours}>
            Daily Service: {CANTEEN_INFO.operatingHours}
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.pillChip}>
              <Text style={styles.pillChipText}>Subsidized Student Rates</Text>
            </View>
            <View style={styles.pillChip}>
              <Text style={styles.pillChipText}>Express Counter Pickup</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          <TouchableOpacity
            style={styles.proceedPill}
            onPress={handleManualProceed}
            activeOpacity={0.85}
            accessibilityLabel="Proceed to Canteen Login"
          >
            <Text style={styles.proceedPillText}>Enter Canteen</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>Dalugama Campus MVP</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary, // Pure black surface
  },
  container: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: SPACING.huge,
  },
  monogram: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.xl, // 16px
    backgroundColor: COLORS.canvas,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  monogramText: {
    fontSize: 26,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  appName: {
    fontSize: FONTS.sizes.displayXl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.onPrimary,
    letterSpacing: -0.5,
  },
  institutionName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.mute,
    marginTop: 2,
  },
  headline: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.onPrimary,
    marginTop: SPACING.md,
    lineHeight: 26,
  },
  cardInfo: {
    backgroundColor: COLORS.blackElevated, // Elevated dark surface
    width: '100%',
    borderRadius: RADIUS.xl, // 16px
    padding: SPACING.xl,
  },
  canteenTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.onDark,
  },
  canteenLocation: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
    marginTop: 4,
  },
  canteenHours: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.onDark,
    marginTop: 6,
    fontWeight: FONTS.weights.medium,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  pillChip: {
    backgroundColor: COLORS.hairlineMid,
    borderRadius: RADIUS.pill, // 999px pill
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
  },
  pillChipText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.onDark,
    fontWeight: FONTS.weights.medium,
  },
  footerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  proceedPill: {
    backgroundColor: COLORS.canvas, // White secondary pill on dark hero
    width: '100%',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.pill, // Signature 999px pill
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  proceedPillText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
  },
  versionText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
  },
});
