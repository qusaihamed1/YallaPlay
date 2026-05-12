import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";

import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import { AUTH_COLORS } from "../constants/auth";
import { validateForgotPasswordEmail } from "../utils/authValidation";
import { auth } from "../Config/firebaseConfig";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const validationError = validateForgotPasswordEmail(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email.trim());

      Alert.alert("Success", "Password reset email sent");
      router.replace("/login");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        Alert.alert("Error", "User not found");
      } else if (err.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address");
      } else if (err.code === "auth/too-many-requests") {
        Alert.alert("Error", "Too many attempts, try again later");
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <ForgotPasswordForm
              email={email}
              error={error}
              loading={loading}
              onChangeEmail={(text) => {
                setEmail(text);
                if (error) setError("");
              }}
              onSubmit={handleReset}
              onBackToLogin={() => router.push("/login")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});