import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
<<<<<<< HEAD
=======
  SafeAreaView,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
<<<<<<< HEAD
import { SafeAreaView } from "react-native";
=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
import LoginForm from "../components/auth/LoginForm";
import { auth, db } from "../Config/firebaseConfig";
import { COLORS } from "../constants/colors";
import { LoginErrors } from "../types/auth";
import { validateLoginForm } from "../utils/authValidation";

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
      const userDoc = await getDoc(doc(db, "users", userUid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        Alert.alert("Welcome", userData.fullName);
      }

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Login failed");
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
onGoToSignup={() => router.push("/signup")}            />
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