import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../Config/firebaseConfig";
import { COLORS } from "../../constants/colors";
import { useOfflineBookings } from "../../hooks/useOfflineBookings";
import useUser from "../../hooks/useUser";

type Booking = {
  id: string;
  fieldName: string;
  date: string;
  time: string | number;
  duration: string | number;
  totalPrice: number;
  paymentMethod?: string;
};

export default function MyBookings() {
  const router = useRouter();
  const userData = useUser();
  const { offlineBookings, addOfflineBooking, deleteOfflineBooking } = useOfflineBookings();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getAvatarLetter = () => {
    const name = userData?.fullName || auth.currentUser?.email || "User";
    return name.charAt(0).toUpperCase();
  };

  const profileImage = userData?.photoUri || null;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const bookingsQuery = query(collection(db, "bookings"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
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
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete booking", "Are you sure you want to delete this booking?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => deleteDoc(doc(db, "bookings", id)),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSmall}>Reservations</Text>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>

        <TouchableOpacity style={styles.avatar} onPress={() => router.push("/(tabs)/profile")}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <Text style={styles.avatarText}>{getAvatarLetter()}</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 130 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListHeaderComponent={
          <View style={styles.offlineCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.offlineTitle}>Offline Bookings</Text>
              <Text style={styles.offlineText}>Saved locally using SQLite for offline mode.</Text>
            </View>
            <TouchableOpacity style={styles.offlineAdd} onPress={() => addOfflineBooking()}>
              <Ionicons name="add" color="#fff" size={20} />
            </TouchableOpacity>

            {offlineBookings.length > 0 && (
              <View style={styles.offlineList}>
                {offlineBookings.slice(0, 3).map((item) => (
                  <TouchableOpacity key={item.id} style={styles.offlineItem} onLongPress={() => deleteOfflineBooking(item.id)}>
                    <Text style={styles.offlineItemText}>{item.fieldName}</Text>
                    <Text style={styles.offlineItemSub}>{item.date} · {item.time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No online bookings yet. Try booking a field from the Booking tab.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.field}>{item.fieldName}</Text>
              <Text style={styles.status}>Confirmed</Text>
            </View>
            <Text style={styles.info}>Date: {item.date}</Text>
            <Text style={styles.info}>Time: {item.time}:00</Text>
            <Text style={styles.info}>Duration: {item.duration} hr</Text>
            {!!item.paymentMethod && <Text style={styles.info}>Payment: {item.paymentMethod}</Text>}
            <Text style={styles.price}>₪ {item.totalPrice}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/edit-booking",
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
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 22,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerSmall: { color: "#D8F7E7", fontSize: 14, fontWeight: "700" },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "900" },
  avatar: { width: 44, height: 44, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImage: { width: "100%", height: "100%" },
  avatarText: { color: "#fff", fontWeight: "900" },
  offlineCard: { backgroundColor: "#fff", borderRadius: 18, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border, flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  offlineTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  offlineText: { color: COLORS.subText, marginTop: 3, fontWeight: "600" },
  offlineAdd: { width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  offlineList: { width: "100%", marginTop: 12, gap: 8 },
  offlineItem: { backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 10 },
  offlineItemText: { color: COLORS.primaryDark, fontWeight: "900" },
  offlineItemSub: { color: COLORS.subText, fontSize: 12, marginTop: 2, fontWeight: "600" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardTop: { flexDirection: "row", justifyContent: "space-between", gap: 10, alignItems: "flex-start" },
  field: { flex: 1, fontSize: 18, fontWeight: "900", marginBottom: 8, color: COLORS.text },
  status: { backgroundColor: COLORS.primaryLight, color: COLORS.primaryDark, fontWeight: "900", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, fontSize: 12 },
  info: { color: COLORS.subText, fontWeight: "700", marginTop: 3 },
  price: { marginTop: 10, fontWeight: "900", color: COLORS.primary, fontSize: 18 },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  editBtn: { flex: 1, backgroundColor: COLORS.primary, padding: 12, borderRadius: 10, alignItems: "center" },
  deleteBtn: { flex: 1, backgroundColor: "#EF4444", padding: 12, borderRadius: 10, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "900" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  emptyText: { textAlign: "center", color: COLORS.subText, fontWeight: "700", padding: 18 },
});
