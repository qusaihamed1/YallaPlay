import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../Config/firebaseConfig";

import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";

export default function Payment() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const total = params.total ? Number(params.total) : 0;

  const validate = () => {
    if (!phone || phone.length < 9) {
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
      const q = query(
        collection(db, "bookings"),
        where("fieldName", "==", params.field),
        where("date", "==", params.date),
        where("time", "==", params.time)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        Alert.alert("This time is already booked");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        userId: user.uid, 

        fieldName: params.field,
        date: params.date,
        time: params.time,
        duration: params.duration,
        totalPrice: total,

        phone: phone,
        email: email,
        paymentMethod: method,

        createdAt: new Date(),
      });

      Alert.alert("Booking Confirmed 🎉");
      router.replace("/booking");

    } catch (error) {
      console.log(error);
      Alert.alert("Something went wrong");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      
      <TouchableOpacity
        onPress={() => router.replace("/booking")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.summary}>
          <Text style={styles.title}>Booking Summary</Text>

          <Text>Field: {params.field}</Text>
          <Text>Date: {params.date}</Text>
          <Text>Time: {params.time}:00</Text>
          <Text>Duration: {params.duration} hr</Text>

          <Text style={styles.price}>₪ {params.total}</Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.method, method === "card" && styles.active]}
            onPress={() => setMethod("card")}
          >
            <Text style={method === "card" && styles.activeText}>💳 Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.method, method === "cash" && styles.active]}
            onPress={() => setMethod("cash")}
          >
            <Text style={method === "cash" && styles.activeText}>💵 Cash</Text>
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
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, "");
                const formatted =
                  cleaned.match(/.{1,4}/g)?.join(" ") || "";
                setCardNumber(formatted);
              }}
            />

            <TextInput
              style={styles.input}
              placeholder="Card Holder Name"
               placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="MM/YY"
                 placeholderTextColor="#999"
                value={expiry}
                onChangeText={setExpiry}
              />

              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="CVV"
                 placeholderTextColor="#999"
                keyboardType="numeric"
                value={cvv}
                onChangeText={(text) =>
                  setCvv(text.replace(/[^0-9]/g, ""))
                }
              />
            </View>
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Phone"
           placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
           placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (!phone || !email) && { backgroundColor: "#aaa" },
          ]}
          onPress={handlePayment}
          disabled={!phone || !email}
        >
          <Text style={styles.buttonText}>
            Pay ₪ {params.total}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 80,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 45,
    height: 45,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  summary: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },

  price: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  method: {
    flex: 1,
    padding: 14,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },

  active: {
    backgroundColor: COLORS.primary,
  },

  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});