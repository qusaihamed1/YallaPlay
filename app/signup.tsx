import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SignupForm from "../components/auth/SignupForm";
import { auth, db } from "../Config/firebaseConfig";
import { AUTH_COLORS } from "../constants/auth";
import { SignupErrors } from "../types/auth";
import { validateSignupForm } from "../utils/authValidation";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});

  const handleSignup = async () => {
    const validationErrors = validateSignupForm({
      fullName,
      email,
      password,
      confirmPassword,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const trimmedFullName = fullName.trim();
      const trimmedEmail = email.trim();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: trimmedFullName,
        email: trimmedEmail,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully");
      router.replace("/login");
    } catch (error: any) {
      if (error?.code === "auth/email-already-in-use") {
        Alert.alert("Error", "This email is already in use");
      } else if (error?.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address");
      } else if (error?.code === "auth/weak-password") {
        Alert.alert("Error", "Password should be at least 6 characters");
      } else {
        Alert.alert("Error", error?.message || "Signup failed");
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <SignupForm
              fullName={fullName}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              errors={errors}
              loading={loading}
              onChangeFullName={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: "" }));
                }
              }}
              onChangeEmail={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              onChangePassword={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              onChangeConfirmPassword={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                  }));
                }
              }}
              onSubmit={handleSignup}
              onGoToLogin={() => router.push("/login")}
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
    paddingVertical: 24,
  },
});