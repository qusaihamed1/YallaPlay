import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../Config/firebaseConfig";
import { COLORS } from "../../constants/colors";
import { createBackendBooking } from "../../services/bookingsService";

export default function Payment() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [saving, setSaving] = useState(false);

  const total = params.total ? Number(params.total) : 0;

  const validate = () => {
    if (!phone || phone.replace(/\D/g, "").length < 9) {
      Alert.alert("Invalid phone number");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid email address");
      return false;
    }

    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        Alert.alert("Invalid card number");
        return false;
      }

      if (!name.trim()) {
        Alert.alert("Enter card holder name");
        return false;
      }

      if (!expiry.includes("/")) {
        Alert.alert("Invalid expiry date");
        return false;
      }

      if (cvv.length < 3) {
        Alert.alert("Invalid CVV");
        return false;
      }
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validate()) return;

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("You must be logged in");
      return;
    }

    try {
      setSaving(true);

      const bookingQuery = query(
        collection(db, "bookings"),
        where("fieldName", "==", params.field),
        where("date", "==", params.date),
        where("time", "==", params.time)
      );

      const snapshot = await getDocs(bookingQuery);

      if (!snapshot.empty) {
        Alert.alert("This time is already booked");
        return;
      }

      const bookingPayload = {
        userId: user.uid,
        fieldId: String(params.fieldId || ""),
        fieldName: String(params.field || ""),
        date: String(params.date || ""),
        time: String(params.time || ""),
        duration: String(params.duration || "1"),
        totalPrice: total,
        phone,
        email,
        paymentMethod: method,
      };

      await addDoc(collection(db, "bookings"), {
        ...bookingPayload,
        createdAt: new Date(),
      });

      try {
        await createBackendBooking(bookingPayload);
      } catch (backendError) {
        console.log("Backend booking sync failed:", backendError);
      }

      Alert.alert("Booking Confirmed", "Your reservation was saved successfully.");
      router.replace("/(tabs)/my-booking");
    } catch (error) {
      console.log(error);
      Alert.alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/booking")} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={styles.title}>Booking Summary</Text>
          <Text style={styles.summaryText}>Field: {params.field}</Text>
          <Text style={styles.summaryText}>Date: {params.date}</Text>
          <Text style={styles.summaryText}>Time: {params.time}:00</Text>
          <Text style={styles.summaryText}>Duration: {params.duration} hr</Text>
          <Text style={styles.price}>₪ {params.total}</Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.method, method === "card" && styles.active]} onPress={() => setMethod("card")}>
            <Text style={[styles.methodText, method === "card" && styles.activeText]}>💳 Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.method, method === "cash" && styles.active]} onPress={() => setMethod("cash")}>
            <Text style={[styles.methodText, method === "cash" && styles.activeText]}>💵 Cash</Text>
          </TouchableOpacity>
        </View>

        {method === "card" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={cardNumber}
              maxLength={19}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, "");
                const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
                setCardNumber(formatted);
              }}
            />

            <TextInput style={styles.input} placeholder="Card Holder Name" placeholderTextColor="#999" value={name} onChangeText={setName} />

            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="MM/YY" placeholderTextColor="#999" value={expiry} onChangeText={setExpiry} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="CVV" placeholderTextColor="#999" keyboardType="numeric" value={cvv} maxLength={3} onChangeText={(text) => setCvv(text.replace(/[^0-9]/g, ""))} />
            </View>
          </>
        )}

        <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#999" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

        <TouchableOpacity style={[styles.button, saving && { opacity: 0.7 }]} onPress={handlePayment} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm Payment ₪ {params.total}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingTop: 84, paddingBottom: 120 },
  backButton: { position: "absolute", top: 50, left: 16, width: 45, height: 45, borderRadius: 999, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", zIndex: 10 },
  summary: { backgroundColor: "#fff", padding: 16, borderRadius: 18, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 21, fontWeight: "900", marginBottom: 10, color: COLORS.text },
  summaryText: { color: COLORS.subText, fontWeight: "700", marginBottom: 5 },
  price: { marginTop: 10, fontSize: 24, fontWeight: "900", color: COLORS.primary },
  sectionTitle: { fontSize: 18, fontWeight: "900", marginBottom: 10, color: COLORS.text },
  row: { flexDirection: "row", gap: 10 },
  method: { flex: 1, padding: 14, backgroundColor: "#E5E7EB", borderRadius: 12, alignItems: "center", marginBottom: 12 },
  methodText: { fontWeight: "800", color: COLORS.text },
  active: { backgroundColor: COLORS.primary },
  activeText: { color: "#fff", fontWeight: "900" },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, color: COLORS.text },
  button: { marginTop: 12, backgroundColor: COLORS.primary, padding: 17, borderRadius: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
