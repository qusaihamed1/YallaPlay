import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import LoginForm from "../components/auth/LoginForm";
import { auth, db } from "../Config/firebaseConfig";
import { COLORS } from "../constants/colors";
import { LoginErrors } from "../types/auth";
import { validateLoginForm } from "../utils/authValidation";
import { saveSecureAuthSession } from "../utils/secureAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleLogin = async () => {
    const validationErrors = validateLoginForm({
      email,
      password,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const userUid = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();
      await saveSecureAuthSession(token, userUid);
      const userDoc = await getDoc(doc(db, "users", userUid));

      if (userDoc.exists()) {
        userDoc.data();
      }

      router.replace("/home");
    } catch (error: any) {
      const code = error?.code || "";

      if (code.includes("wrong-password") || code.includes("invalid-credential")) {
        setErrors({ password: "Incorrect password or email" });
      } else if (code.includes("user-not-found")) {
        setErrors({ email: "No account found with this email" });
      } else if (code.includes("invalid-email")) {
        setErrors({ email: "Invalid email address" });
      } else if (code.includes("too-many-requests")) {
        setErrors({ password: "Too many attempts. Try again later" });
      } else {
        setErrors({ password: "Login failed. Please check your email and password" });
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
            <LoginForm
              email={email}
              password={password}
              errors={errors}
              loading={loading}
              onChangeEmail={(text: string) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              onChangePassword={(text: string) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              onSubmit={handleLogin}
              onForgotPassword={() => router.push("/forgot-password")}
              onGoToSignup={() => router.push("/signup")}
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
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
});