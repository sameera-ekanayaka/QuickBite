import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Default starter screen for QuickBite campus food ordering app.
// Confirms environment setup and base configuration for University of Kelaniya canteen system.
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.title}>QuickBite</Text>
        <Text style={styles.subtitle}>University of Kelaniya Canteen</Text>
        <Text style={styles.description}>
          Campus Food Pre-Ordering and Real-Time Tracking App
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Environment Setup Complete</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#800000', // University of Kelaniya maroon tone
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
});
