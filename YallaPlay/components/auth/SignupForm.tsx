import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AUTH_COLORS } from "../../constants/auth";
import { SignupFormProps } from "../../types/auth";

export default function SignupForm({
  fullName,
  email,
  password,
  confirmPassword,
  errors,
  loading,
  onChangeFullName,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  onSubmit,
  onGoToLogin,
}: SignupFormProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -8,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, translateAnim, logoFloat]);

  return (
    <View style={styles.screen}>
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoBanner,
            {
              transform: [{ translateY: logoFloat }],
            },
          ]}
        >
          <Text style={styles.logoEmoji}>⚽</Text>
        </Animated.View>

        <Text style={styles.brand}>Yalla Play</Text>
        <Text style={styles.subtitle}>Create your account and start playing</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor={AUTH_COLORS.subText}
            style={[styles.input, errors.fullName ? styles.inputError : null]}
            value={fullName}
            onChangeText={onChangeFullName}
            returnKeyType="next"
          />
          {!!errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

          <Text style={[styles.label, styles.fieldSpacing]}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={AUTH_COLORS.subText}
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={email}
            onChangeText={onChangeEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
          {!!errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text style={[styles.label, styles.fieldSpacing]}>Password</Text>
          <TextInput
            placeholder="Create password"
            placeholderTextColor={AUTH_COLORS.subText}
            secureTextEntry
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={password}
            onChangeText={onChangePassword}
            returnKeyType="next"
          />
          {!!errors.password && <Text style={styles.error}>{errors.password}</Text>}

          <Text style={[styles.label, styles.fieldSpacing]}>Confirm Password</Text>
          <TextInput
            placeholder="Re-enter password"
            placeholderTextColor={AUTH_COLORS.subText}
            secureTextEntry
            style={[
              styles.input,
              errors.confirmPassword ? styles.inputError : null,
            ]}
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
          {!!errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : null]}
            onPress={onSubmit}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToLogin} activeOpacity={0.8}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    position: "relative",
  },

  backgroundCircleOne: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#DFF3E8",
    top: -30,
    right: -40,
    opacity: 0.8,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EDF8F1",
    bottom: 40,
    left: -25,
  },

  card: {
    backgroundColor: AUTH_COLORS.white,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  logoBanner: {
    backgroundColor: "#DDEFE8",
    borderRadius: 16,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  logoEmoji: {
    fontSize: 28,
  },

  brand: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: AUTH_COLORS.primary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 15,
    color: AUTH_COLORS.subText,
    textAlign: "center",
    marginBottom: 22,
    fontWeight: "500",
  },

  formSection: {
    marginTop: 4,
  },

  label: {
    fontSize: 14,
    color: "#5E5E5E",
    marginBottom: 8,
    fontWeight: "600",
  },

  fieldSpacing: {
    marginTop: 6,
  },

  input: {
    backgroundColor: "#FCFCFC",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#DADADA",
    color: AUTH_COLORS.text,
    fontSize: 15,
  },

  inputError: {
    borderColor: AUTH_COLORS.error,
  },

  error: {
    color: AUTH_COLORS.error,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 2,
  },

  button: {
    backgroundColor: AUTH_COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: AUTH_COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  loginText: {
    marginTop: 18,
    textAlign: "center",
    color: AUTH_COLORS.subText,
    fontSize: 14,
  },

  loginLink: {
    color: AUTH_COLORS.primary,
    fontWeight: "700",
  },
});