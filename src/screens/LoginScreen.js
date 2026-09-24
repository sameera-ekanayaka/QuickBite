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
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { validateEmail, validateStudentId, validatePassword } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

// Student Login & Guest Access Screen.
// Provides robust credentials validation, support for University of Kelaniya
// student email/ID format, and instant guest mode access.
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
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>QuickBite</Text>
            </View>
            <Text style={styles.title}>Canteen Portal</Text>
            <Text style={styles.subtitle}>
              University of Kelaniya - Student Pre-Ordering
            </Text>
          </View>

          {generalError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{generalError}</Text>
            </View>
          ) : null}

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Student Email or Registration ID</Text>
              <TextInput
                style={[styles.input, identifierError ? styles.inputError : null]}
                placeholder="e.g. ps2021045@stu.kln.ac.lk or PS/2021/045"
                placeholderTextColor={COLORS.textMuted}
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
              ) : (
                <Text style={styles.inputHint}>
                  Use your official University of Kelaniya student credentials
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder="Enter your canteen password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                secureTextEntry
              />
              {passwordError ? (
                <Text style={styles.fieldErrorText}>{passwordError}</Text>
              ) : (
                <Text style={styles.inputHint}>Minimum 6 characters required</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleLogin}
              activeOpacity={0.85}
              accessibilityLabel="Sign in with student account"
            >
              <Text style={styles.signInButtonText}>Sign In to Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={fillDemoCredentials}
              activeOpacity={0.7}
              accessibilityLabel="Autofill student demo credentials"
            >
              <Text style={styles.demoButtonText}>Autofill Demo Student ID</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestAccess}
            activeOpacity={0.8}
            accessibilityLabel="Continue as guest student"
          >
            <Text style={styles.guestButtonText}>Continue as Guest Student</Text>
            <Text style={styles.guestButtonSubtext}>
              Instant order access without logging in
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  brandBadge: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  brandBadgeText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: COLORS.dangerLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.lg,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  inputError: {
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
    color: COLORS.textMuted,
    marginTop: 4,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  demoButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },
  demoButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerLabel: {
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.semibold,
  },
  guestButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  guestButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  guestButtonSubtext: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
