import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "../../Config/firebaseConfig";
import FieldCard from "../../components/home/fieldCard";
import { COLORS } from "../../constants/colors";
import { footballFields } from "../../data/fields";

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export default function EditBooking() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [userName, setUserName] = useState("User");

  const [selectedField, setSelectedField] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [duration, setDuration] = useState(1);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) {
      setUserName(user.email.split("@")[0]);
    }
  }, []);

  const avatarLetter = getFirstLetter(userName);

  useEffect(() => {
    const loadBooking = async () => {
      if (!id) return;

      const ref = doc(db, "bookings", String(id));
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const data: any = snap.data();

      const field = footballFields.find(
        (f) => f.name === data.fieldName
      );

      setSelectedField(field || null);
      setSelectedDate({
        label: data.date,
        value: new Date(data.date),
      });
      setSelectedTime(data.time);
      setDuration(data.duration);
    };

    loadBooking();
  }, [id]);

  const generateDates = () => {
    let arr = [];
    for (let i = 0; i < 7; i++) {
      let d = new Date();
      d.setDate(d.getDate() + i);

      arr.push({
        label: d.toLocaleDateString(),
        value: d,
      });
    }
    return arr;
  };

  const dates = generateDates();

  const generateTimes = () => {
    let times = [];
    for (let i = 0; i < 24; i++) {
      let hour = i % 12 || 12;
      let period = i < 12 ? "AM" : "PM";

      times.push({
        label: `${hour}:00 ${period}`,
        value: i,
      });
    }
    return times;
  };

  const timeSlots = generateTimes();

  const getPriceNumber = (price: string) => {
    const match = price.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const pricePerHour = selectedField
    ? getPriceNumber(selectedField.price)
    : 0;

  const totalPrice = pricePerHour * duration;

  const handleUpdate = async () => {
    if (!selectedField || !selectedDate || selectedTime === null) {
      Alert.alert("Please select all data");
      return;
    }

    try {
      const q = query(
        collection(db, "bookings"),
        where("fieldName", "==", selectedField.name),
        where("date", "==", selectedDate.label),
        where("time", "==", selectedTime)
      );

      const snapshot = await getDocs(q);

      const conflict = snapshot.docs.find(
        (docItem) => docItem.id !== id
      );

      if (conflict) {
        Alert.alert("❌ This slot is already booked");
        return;
      }

      const ref = doc(db, "bookings", String(id));

      await updateDoc(ref, {
        fieldName: selectedField.name,
        date: selectedDate.label,
        time: selectedTime,
        duration: duration,
        totalPrice: totalPrice,
      });

      Alert.alert("✅ Booking Updated");

      router.replace("/my-booking");

    } catch (err) {
      console.log(err);
      Alert.alert("Error updating booking");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <TouchableOpacity
        onPress={() => router.replace("/my-booking")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Edit Booking</Text>
          <Text style={styles.name}>Update your slot</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Choose a field</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {footballFields.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedField(item)}
              style={{ marginRight: 12 }}
            >
              <View
                style={
                  selectedField?.id === item.id && styles.activeCard
                }
              >
                <FieldCard {...item} selectedSport="football" disablePress />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.title}>Select date</Text>
        <View style={styles.row}>
          {dates.map((d) => (
            <TouchableOpacity
              key={d.label}
              style={[
                styles.chip,
                selectedDate?.label === d.label && styles.active,
              ]}
              onPress={() => setSelectedDate(d)}
            >
              <Text
                style={
                  selectedDate?.label === d.label && styles.activeText
                }
              >
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Select time</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowTimePicker(!showTimePicker)}
        >
          <Text>
            {selectedTime !== null
              ? timeSlots.find((t) => t.value === selectedTime)?.label
              : "Choose time"}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <View style={styles.dropdownList}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedTime(time.value);
                  setShowTimePicker(false);
                }}
              >
                <Text>{time.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.title}>Duration</Text>
        <View style={styles.row}>
          {[1, 2, 3].map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.chip, duration === h && styles.active]}
              onPress={() => setDuration(h)}
            >
              <Text style={duration === h && styles.activeText}>
                {h} hr
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text>Field: {selectedField?.name}</Text>
          <Text>Date: {selectedDate?.label}</Text>
          <Text>Time: {selectedTime}</Text>
          <Text>Duration: {duration} hr</Text>
          <Text style={styles.total}>₪ {totalPrice}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { color: "#D8F7E7" },
  name: { color: "#fff", fontSize: 22, fontWeight: "800" },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "bold" },
  container: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 18, fontWeight: "800", marginTop: 10 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { padding: 10, backgroundColor: "#eee", borderRadius: 20 },
  active: { backgroundColor: COLORS.primary },
  activeText: { color: "#fff" },
  dropdown: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  summary: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  summaryTitle: { fontWeight: "800", marginBottom: 10 },
  total: { marginTop: 10, fontWeight: "bold", fontSize: 18 },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  activeCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    padding: 4,
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
});