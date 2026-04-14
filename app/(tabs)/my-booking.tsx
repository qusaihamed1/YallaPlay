import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../../Config/firebaseConfig";
import { COLORS } from "../../constants/colors";

// ✅ نوع الحجز
type Booking = {
  id: string;
  fieldName: string;
  date: string;
  time: number;
  duration: number;
  totalPrice: number;
};

export default function MyBookings() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ أول حرف للأفاتار
  const getAvatarLetter = () => {
    const user = auth.currentUser;
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  // ✅ Real-time listener
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Booking[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Booking, "id">),
      }));

      setBookings(data);
      setLoading(false);
      setRefreshing(false);
    });

    return unsubscribe;
  }, []);

  const onRefresh = () => {
  setRefreshing(true);

  // نوقفه مباشرة لأنه realtime already
  setTimeout(() => {
    setRefreshing(false);
  }, 800);
};

  // ✅ حذف
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "bookings", id));
  };

  // ✅ Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* 🟢 HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>

        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.avatarText}>
            {getAvatarLetter()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📋 LIST */}
      {bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: "#777" }}>No bookings yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.field}>{item.fieldName}</Text>

              <Text>Date: {item.date}</Text>
              <Text>Time: {item.time}:00</Text>
              <Text>Duration: {item.duration} hr</Text>

              <Text style={styles.price}>
                ₪ {item.totalPrice}
              </Text>

              {/* 🔘 Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() =>
  router.push({
    pathname: "/edit-booking",
    params: {
      id: item.id,
      fieldName: item.fieldName,
      date: item.date,
      time: item.time,
      duration: item.duration,
    },
  })
}
                >
                  <Text style={{ color: "#fff" }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={{ color: "#fff" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // 🟢 HEADER
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    margin: 12,
  },

  field: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  price: {
    marginTop: 10,
    fontWeight: "bold",
    color: COLORS.primary,
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  editBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 72,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});