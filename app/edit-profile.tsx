import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../Config/firebaseConfig";
import { COLORS } from "../constants/colors";

export default function EditProfile() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  // ✅ تحميل البيانات من فايربيز
  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setFullName(snap.data().fullName || "");
        } else {
          // fallback من الايميل
          setFullName(user.email?.split("@")[0] || "");
        }
      } catch (err) {
        Alert.alert("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ حفظ التعديل
  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Enter your name");
      return;
    }

    if (!user) return;

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: fullName,
          email: user.email,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      Alert.alert("Profile updated ✅");

      router.back(); // 🔙 يرجع للبروفايل

    } catch (error) {
      Alert.alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>
      </View>

      {/* 📄 FORM */}
      <View style={styles.container}>
        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your name"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  back: {
    color: "#fff",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  container: {
    padding: 16,
  },

  label: {
    marginBottom: 6,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});