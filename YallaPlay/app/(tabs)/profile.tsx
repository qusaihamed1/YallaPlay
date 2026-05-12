import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../../Config/firebaseConfig";
import { COLORS } from "../../constants/colors";
import { getSportLabel, SPORTS } from "../../constants/sports";
import { useAppContext } from "../../context/AppContext";
import useUser from "../../hooks/useUser";
import { clearSecureAuthSession } from "../../utils/secureAuth";

const INTRO_KEY = "yallaplay_intro_seen_v2";
const SKIP_SPLASH_KEY = "yallaplay_skip_splash_once";

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

function ProfileAction({ icon, title, subtitle, onPress }: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.actionIconWrap}>
        <Text style={styles.actionIcon}>{icon}</Text>
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function Profile() {
  const router = useRouter();
  const userData = useUser();
  const { favoriteSport, changeFavoriteSport, favorites } = useAppContext();

  const [bookingsCount, setBookingsCount] = useState(0);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fullName = userData?.fullName || auth.currentUser?.email?.split("@")[0] || "User";
  const email = userData?.email || auth.currentUser?.email || "";
  const avatarLetter = getFirstLetter(fullName);

  const profileCompletion = useMemo(() => {
    const fields = [
      userData?.fullName,
      userData?.email || email,
      userData?.phone,
      userData?.city,
      userData?.photoUri,
      userData?.favoriteSport,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [userData, email]);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      router.replace("/login");
      return;
    }

    const q = query(collection(db, "bookings"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setBookingsCount(snapshot.size);
        setLoadingBookings(false);
      },
      () => {
        setBookingsCount(0);
        setLoadingBookings(false);
      }
    );

    return unsubscribe;
  }, [router]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem(INTRO_KEY, "true");
      await AsyncStorage.setItem(SKIP_SPLASH_KEY, "true");
      await clearSecureAuthSession();
      await signOut(auth);
      (router as any).dismissAll?.();
      router.replace("/login");
    } catch {
      Alert.alert("Error", "Could not log out. Please try again.");
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.avatarLarge}>
            {userData?.photoUri ? (
              <Image source={{ uri: userData.photoUri }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.name} numberOfLines={1}>{fullName}</Text>
            <Text style={styles.email} numberOfLines={1}>{email}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>YallaPlay Member</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editCircle} onPress={() => router.push("/edit-profile")}> 
            <Text style={styles.editCircleText}>✎</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            {loadingBookings ? <ActivityIndicator color="#fff" /> : <Text style={styles.statNumber}>{bookingsCount}</Text>}
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profileCompletion}%</Text>
            <Text style={styles.statLabel}>Profile</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userData?.phone || "Not added"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>{userData?.city || "Not added"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Favorite sport</Text>
            <Text style={styles.infoValue}>{getSportLabel(userData?.favoriteSport || favoriteSport)}</Text>
          </View>
          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.infoLabel}>Bio</Text>
            <Text style={styles.infoValue} numberOfLines={2}>{userData?.bio || "No bio yet"}</Text>
          </View>
        </View>

        <View style={styles.preferenceCard}>
          <Text style={styles.cardTitle}>Quick Preferences</Text>
          <Text style={styles.cardSubtitle}>Saved using Context API + Async Storage</Text>
          <View style={styles.sportButtonsRow}>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.value}
                style={[styles.sportButton, favoriteSport === sport.value && styles.sportButtonActive]}
                onPress={() => changeFavoriteSport(sport.value)}
              >
                <Text style={[styles.sportButtonText, favoriteSport === sport.value && styles.sportButtonTextActive]}>
                  {sport.emoji} {sport.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>
          <ProfileAction icon="📅" title="My Bookings" subtitle="View, edit, and manage your reservations" onPress={() => router.push("/my-booking")} />
          <ProfileAction icon="👤" title="Edit Profile" subtitle="Photo, phone, city, sport, and bio" onPress={() => router.push("/edit-profile")} />
          <ProfileAction icon="🔒" title="Change Password" subtitle="Send a Firebase password reset email" onPress={() => router.push("/forgot-password")} />
          <ProfileAction icon="💳" title="Payment Methods" subtitle="Cash and card preferences for future bookings" onPress={() => Alert.alert("Payment Methods", "Cash on arrival and card options are prepared for launch.")} />
          <ProfileAction icon="⭐" title="Favorite Fields" subtitle={`${favorites.length} saved locally with Async Storage`} onPress={() => router.push("/favorite-fields")} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support</Text>
          <ProfileAction icon="📍" title="Nearby Fields" subtitle="Find fields using your current location" onPress={() => router.push("/(tabs)/home")} />
          <ProfileAction icon="🔔" title="Notifications" subtitle="Booking reminders and offers" onPress={() => Alert.alert("Notifications", "Booking reminders are ready to connect with push notifications.")} />
          <ProfileAction icon="💬" title="Help Center" subtitle="Contact support for booking questions" onPress={() => Alert.alert("Help Center", "For demo: support@yallaplay.app")} />
          <ProfileAction icon="ℹ️" title="About YallaPlay" subtitle="Reserve faster. Play smarter. Enjoy more." onPress={() => Alert.alert("YallaPlay", "A multi-sport reservation app for fields and courts in the West Bank.")} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 58,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: { flexDirection: "row", alignItems: "center" },
  avatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.24)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%" },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "900" },
  userInfo: { flex: 1, marginLeft: 12 },
  name: { color: "#fff", fontSize: 22, fontWeight: "900" },
  email: { color: "#D8F7E7", fontSize: 13, marginTop: 3 },
  memberBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
  },
  memberBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  editCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  editCircleText: { color: "#fff", fontSize: 18, fontWeight: "900" },
  statsRow: {
    marginTop: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statBox: { alignItems: "center", flex: 1 },
  statDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.22)" },
  statNumber: { color: "#fff", fontSize: 20, fontWeight: "900" },
  statLabel: { color: "#D8F7E7", fontSize: 12, marginTop: 3, fontWeight: "700" },
  container: { padding: 16, paddingBottom: 120 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  preferenceCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text, marginBottom: 4 },
  cardSubtitle: { color: COLORS.subText, fontSize: 12, marginBottom: 12 },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F2F4",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  lastInfoRow: { borderBottomWidth: 0 },
  infoLabel: { color: COLORS.subText, fontWeight: "700", flex: 0.85 },
  infoValue: { color: COLORS.text, fontWeight: "800", flex: 1.15, textAlign: "right" },
  sportButtonsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  sportButton: {
    minWidth: "46%",
    flexGrow: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  sportButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sportButtonText: { color: COLORS.text, fontWeight: "900" },
  sportButtonTextActive: { color: "#fff" },
  sectionTitle: { fontWeight: "900", fontSize: 14, paddingHorizontal: 14, paddingVertical: 10, color: COLORS.subText },
  actionItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 13 },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionIcon: { fontSize: 20 },
  actionContent: { flex: 1 },
  actionTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  actionSubtitle: { color: COLORS.subText, fontSize: 12, marginTop: 2 },
  chevron: { fontSize: 26, color: COLORS.mutedIcon, fontWeight: "300" },
  logoutBtn: {
    marginTop: 4,
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "900", fontSize: 15 },
});
