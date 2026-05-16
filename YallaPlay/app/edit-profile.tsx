import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../Config/firebaseConfig";
import { COLORS } from "../constants/colors";
import { useAppContext } from "../context/AppContext";
import { SPORTS } from "../constants/sports";
import { SportType } from "../types/home";

type ProfileFormValues = {
  fullName: string;
  phone: string;
  city: string;
  favoriteSport: SportType;
  bio: string;
};

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export default function EditProfile() {
  const router = useRouter();
  const user = auth.currentUser;
  const { favoriteSport, changeFavoriteSport } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      favoriteSport,
      bio: "",
    },
  });

  const selectedSport = watch("favoriteSport");
  const fullName = watch("fullName");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};

        setValue("fullName", data.fullName || user.email?.split("@")[0] || "");
        setValue("phone", data.phone || "");
        setValue("city", data.city || "Nablus");
        setValue("favoriteSport", data.favoriteSport || favoriteSport);
        setValue("bio", data.bio || "");
        setPhotoUri(data.photoUri || null);
      } catch {
        Alert.alert("Error", "Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [favoriteSport, router, setValue, user]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo access to choose a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onSave = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: values.fullName.trim(),
          email: user.email,
          phone: values.phone.trim(),
          city: values.city.trim(),
          favoriteSport: values.favoriteSport,
          bio: values.bio.trim(),
          photoUri,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      await changeFavoriteSport(values.favoriteSport);

      Alert.alert("Saved", "Your profile has been updated successfully.");
      router.back();
    } catch {
      Alert.alert("Error", "Could not save your profile.");
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>Keep your account ready for faster reservations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarLarge} onPress={pickImage} activeOpacity={0.85}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <Text style={styles.avatarText}>{getFirstLetter(fullName)}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Information</Text>

          <Text style={styles.label}>Full Name</Text>
          <Controller
            control={control}
            name="fullName"
            rules={{ required: "Full name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } }}
            render={({ field: { value, onChange } }) => (
              <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="Enter your full name" />
            )}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

          <Text style={styles.label}>Phone Number</Text>
          <Controller
            control={control}
            name="phone"
            rules={{ minLength: { value: 7, message: "Enter a valid phone number" } }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="0590000000"
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

          <Text style={styles.label}>City</Text>
          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="Nablus" />
            )}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Playing Preferences</Text>
          <Text style={styles.label}>Favorite Sport</Text>

          <View style={styles.sportButtonsRow}>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.value}
                style={[styles.sportButton, selectedSport === sport.value && styles.sportButtonActive]}
                onPress={() => setValue("favoriteSport", sport.value)}
              >
                <Text style={[styles.sportButtonText, selectedSport === sport.value && styles.sportButtonTextActive]}>
                  {sport.emoji} {sport.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Bio</Text>
          <Controller
            control={control}
            name="bio"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={value}
                onChangeText={onChange}
                placeholder="Example: I usually play on weekends with my friends."
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSave)} disabled={saving} activeOpacity={0.85}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 58,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  back: { color: "#fff", marginBottom: 10, fontWeight: "800" },
  title: { color: "#fff", fontSize: 24, fontWeight: "900" },
  subtitle: { color: "#D8F7E7", marginTop: 4, fontSize: 13 },
  container: { padding: 16, paddingBottom: 120 },
  avatarSection: { alignItems: "center", marginBottom: 16 },
  avatarLarge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarImage: { width: "100%", height: "100%" },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "900" },
  photoButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoButtonText: { color: COLORS.primary, fontWeight: "900" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 17, fontWeight: "900", color: COLORS.text, marginBottom: 14 },
  label: { marginBottom: 7, marginTop: 6, fontWeight: "800", color: COLORS.text },
  input: {
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
    color: COLORS.text,
  },
  textArea: { minHeight: 92 },
  errorText: { color: "#EF4444", marginBottom: 8, fontSize: 12, fontWeight: "700" },
  sportButtonsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  sportButton: {
    minWidth: "46%",
    flexGrow: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  sportButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sportButtonText: { color: COLORS.text, fontWeight: "900" },
  sportButtonTextActive: { color: "#fff" },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "900", fontSize: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
});
