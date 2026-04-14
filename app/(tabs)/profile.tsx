import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

import { signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../Config/firebaseConfig";
import { COLORS } from "../../constants/colors";
import useUser from "../../hooks/useUser";

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export default function Profile() {
  const router = useRouter();

  const userData = useUser(); // ✅ المصدر الوحيد لليوزر

  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fullName = userData?.fullName || "User";
  const avatarLetter = getFirstLetter(fullName);

  // ✅ جلب عدد الحجوزات (Realtime)
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      router.replace("/login");
      return;
    }

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookingsCount(snapshot.size);
      setLoading(false);
    });

    return unsubscribe; // ✅ clean unsubscribe
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error logging out");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>

          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>
              {userData?.fullName || "User"}
            </Text>
            <Text style={styles.email}>
              {userData?.email || ""}
            </Text>
          </View>
        </View>

        {/* 📊 Stats */}
        <View style={styles.stats}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{bookingsCount}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
          )}
        </View>
      </View>

      {/* 📜 CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>

        {/* ⚡ Quick Actions */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push("/my-booking")}
          >
            <Text style={styles.itemText}>📅 My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={styles.itemText}>✏️ Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.itemText}>🔒 Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* 🚪 Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarLarge: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  email: {
    color: "#D8F7E7",
    fontSize: 13,
    marginTop: 2,
  },

  stats: {
    flexDirection: "row",
    marginTop: 20,
  },
  statBox: {
    marginRight: 20,
  },
  statNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#D8F7E7",
    fontSize: 12,
  },

  container: {
    padding: 16,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 8,
  },

  sectionTitle: {
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 6,
    paddingHorizontal: 12,
    color: "#666",
  },

  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  itemText: {
    fontSize: 15,
    fontWeight: "500",
  },

  logoutBtn: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});