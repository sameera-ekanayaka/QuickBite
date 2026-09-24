import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { ORDER_STATUSES } from '../context/OrderContext';

// Uber-Inspired Order Pipeline Tracker.
// High-contrast monochromatic stage indicators with geometric connectors.
export default function StatusTracker({ currentStatus }) {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);

  const getStageDescription = (status) => {
    switch (status) {
      case 'Placed':
        return 'Order received by the University of Kelaniya canteen system.';
      case 'Preparing':
        return 'Canteen kitchen staff are currently preparing and packing your meal.';
      case 'Ready for Pickup':
        return 'Your meal is ready for collection at the assigned counter. Please present your Order ID.';
      case 'Completed':
        return 'Order collected. Enjoy your meal and best of luck with your lectures!';
      default:
        return 'Order status pending.';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {ORDER_STATUSES.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <React.Fragment key={status}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.circle,
                    isCompleted && styles.circleCompleted,
                    isCurrent && styles.circleCurrent,
                    isUpcoming && styles.circleUpcoming,
                  ]}
                >
                  <Text
                    style={[
                      styles.circleText,
                      isCompleted && styles.circleTextCompleted,
                      isCurrent && styles.circleTextCurrent,
                      isUpcoming && styles.circleTextUpcoming,
                    ]}
                  >
                    {isCompleted ? 'OK' : index + 1}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.stepLabel,
                    isCurrent && styles.stepLabelCurrent,
                    isCompleted && styles.stepLabelCompleted,
                  ]}
                  numberOfLines={2}
                >
                  {status}
                </Text>
              </View>

              {index < ORDER_STATUSES.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    index < currentIndex
                      ? styles.connectorActive
                      : styles.connectorInactive,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <View style={styles.statusDescriptionBox}>
        <Text style={styles.currentStatusTitle}>Current Stage: {currentStatus}</Text>
        <Text style={styles.statusDescriptionText}>
          {getStageDescription(currentStatus)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl, // 16px card
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  stepItem: {
    alignItems: 'center',
    width: 68,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  circleCompleted: {
    backgroundColor: COLORS.primary, // Black
  },
  circleCurrent: {
    backgroundColor: COLORS.primary, // Black
    borderWidth: 2,
    borderColor: COLORS.surfacePressed,
  },
  circleUpcoming: {
    backgroundColor: COLORS.canvasSoft,
  },
  circleText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  circleTextCompleted: {
    color: COLORS.onPrimary,
  },
  circleTextCurrent: {
    color: COLORS.onPrimary,
  },
  circleTextUpcoming: {
    color: COLORS.mute,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.mute,
    textAlign: 'center',
    fontWeight: FONTS.weights.medium,
  },
  stepLabelCurrent: {
    color: COLORS.ink,
    fontWeight: FONTS.weights.bold,
  },
  stepLabelCompleted: {
    color: COLORS.ink,
    fontWeight: FONTS.weights.medium,
  },
  connector: {
    flex: 1,
    height: 2,
    marginTop: 17, // Vertically center with 34px circles
    marginHorizontal: 2,
  },
  connectorActive: {
    backgroundColor: COLORS.primary,
  },
  connectorInactive: {
    backgroundColor: COLORS.canvasSoft,
  },
  statusDescriptionBox: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  currentStatusTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    marginBottom: 4,
  },
  statusDescriptionText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.body,
    lineHeight: 18,
  },
});
