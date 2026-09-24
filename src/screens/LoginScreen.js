import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { validateEmail, validateStudentId, validatePassword } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

// Uber-Inspired Student Authentication Screen.
// Features a clean 16px card container, 8px canvas-soft input rows,
// and canonical 999px black pill action buttons.
export default function LoginScreen({ navigation }) {
  const { login, loginAsGuest } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Validate inputs before authentication
  const handleLogin = () => {
    setIdentifierError('');
    setPasswordError('');
    setGeneralError('');

    const cleanIdentifier = identifier.trim();

    // Check if input is an email or student registration ID
    let idValid = false;
    let idMessage = '';

    if (cleanIdentifier.includes('@')) {
      const emailCheck = validateEmail(cleanIdentifier);
      idValid = emailCheck.isValid;
      idMessage = emailCheck.message;
    } else {
      const regCheck = validateStudentId(cleanIdentifier);
      idValid = regCheck.isValid;
      idMessage = regCheck.message;
    }

    if (!idValid) {
      setIdentifierError(idMessage || 'Please enter a valid Student ID or University Email.');
      return;
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      setPasswordError(passCheck.message);
      return;
    }

    // Authenticate and transition to Home
    const result = login(cleanIdentifier, password);
    if (result.success) {
      navigation.replace('Home');
    } else {
      setGeneralError('Authentication failed. Please verify your credentials.');
    }
  };

  // Immediate guest student access
  const handleGuestAccess = () => {
    loginAsGuest('Guest Student');
    navigation.replace('Home');
  };

  // Quick fill helper for lecturers and evaluators
  const fillDemoCredentials = () => {
    setIdentifier('ps2021045@stu.kln.ac.lk');
    setPassword('klnPass#2026');
    setIdentifierError('');
    setPasswordError('');
    setGeneralError('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.brandMonogram}>
              <Text style={styles.brandMonogramText}>QB</Text>
            </View>
            <Text style={styles.title}>What's your student ID?</Text>
            <Text style={styles.subtitle}>
              University of Kelaniya canteen pre-ordering portal
            </Text>
          </View>

          {generalError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{generalError}</Text>
            </View>
          ) : null}

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Student email or registration ID</Text>
              <TextInput
                style={[styles.inputRow, identifierError ? styles.inputRowError : null]}
                placeholder="e.g. ps2021045@stu.kln.ac.lk or PS/2021/045"
                placeholderTextColor={COLORS.mute}
                value={identifier}
                onChangeText={(text) => {
                  setIdentifier(text);
                  if (identifierError) setIdentifierError('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {identifierError ? (
                <Text style={styles.fieldErrorText}>{identifierError}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.inputRow, passwordError ? styles.inputRowError : null]}
                placeholder="Enter password"
                placeholderTextColor={COLORS.mute}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                secureTextEntry
              />
              {passwordError ? (
                <Text style={styles.fieldErrorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Signature Uber Black CTA Pill */}
            <TouchableOpacity
              style={styles.primaryPill}
              onPress={handleLogin}
              activeOpacity={0.85}
              accessibilityLabel="Sign in with student account"
            >
              <Text style={styles.primaryPillText}>Sign in to order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoFillButton}
              onPress={fillDemoCredentials}
              activeOpacity={0.7}
              accessibilityLabel="Autofill student demo credentials"
            >
              <Text style={styles.demoFillText}>Autofill demo credentials</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary Guest Pill */}
          <TouchableOpacity
            style={styles.guestPill}
            onPress={handleGuestAccess}
            activeOpacity={0.85}
            accessibilityLabel="Continue as guest student"
          >
            <Text style={styles.guestPillText}>Continue as guest student</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  brandMonogram: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md, // 8px
    backgroundColor: COLORS.primary, // Black
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  brandMonogramText: {
    color: COLORS.onPrimary,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold,
    color: COLORS.ink,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.body,
    marginTop: 6,
  },
  errorBanner: {
    backgroundColor: COLORS.dangerLight,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  formCard: {
    backgroundColor: COLORS.canvas,
    borderRadius: RADIUS.xl, // 16px
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.ink,
    marginBottom: 6,
  },
  inputRow: {
    backgroundColor: COLORS.canvasSoft, // '#EFEFEF'
    borderRadius: RADIUS.md, // 8px
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.sm,
    color: COLORS.ink,
  },
  inputRowError: {
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
  primaryPill: {
    backgroundColor: COLORS.primary, // '#000000'
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.pill, // 999px pill
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  primaryPillText: {
    color: COLORS.onPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
  demoFillButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },
  demoFillText: {
    color: COLORS.body,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
  },
  guestPill: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.pill, // 999px pill
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  guestPillText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.ink,
  },
});
