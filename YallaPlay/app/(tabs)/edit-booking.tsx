import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../Config/firebaseConfig";
import FieldCard from "../../components/home/fieldCard";
import { COLORS } from "../../constants/colors";
import { useFields } from "../../hooks/useFields";
import { getFieldImage } from "../../utils/fieldImages";

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

function formatTime(value: number) {
  const hour = value % 12 || 12;
  const period = value < 12 ? "AM" : "PM";
  return `${hour}:00 ${period}`;
}

export default function EditBooking() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: fields = [] } = useFields();

  const [userName, setUserName] = useState("User");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) setUserName(user.email.split("@")[0]);
  }, []);

  const selectedField = useMemo(
    () => fields.find((field) => field.id === selectedFieldId) || null,
    [fields, selectedFieldId]
  );

  useEffect(() => {
    const loadBooking = async () => {
      if (!id) return;
      const ref = doc(db, "bookings", String(id));
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data: any = snap.data();
      const field = fields.find((item) => item.name === data.fieldName);
      setSelectedFieldId(field?.id || null);
      setSelectedDate({ label: data.date, value: new Date(data.date) });
      setSelectedTime(Number(data.time));
      setDuration(Number(data.duration || 1));
    };

    loadBooking();
  }, [id, fields]);

  const avatarLetter = getFirstLetter(userName);

  const dates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push({ label: d.toLocaleDateString(), value: d });
    }
    return arr;
  }, []);

  const timeSlots = useMemo(() => {
    const times = [];
    for (let i = 8; i <= 23; i++) times.push({ label: formatTime(i), value: i });
    return times;
  }, []);

  const totalPrice = selectedField ? Number(selectedField.price) * duration : 0;

  const handleUpdate = async () => {
    if (!selectedField || !selectedDate || selectedTime === null) {
      Alert.alert("Please select all data");
      return;
    }

    try {
      const bookingQuery = query(
        collection(db, "bookings"),
        where("fieldName", "==", selectedField.name),
        where("date", "==", selectedDate.label),
        where("time", "==", String(selectedTime))
      );

      const snapshot = await getDocs(bookingQuery);
      const conflict = snapshot.docs.find((docItem) => docItem.id !== id);

      if (conflict) {
        Alert.alert("This slot is already booked");
        return;
      }

      const ref = doc(db, "bookings", String(id));
      await updateDoc(ref, {
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        date: selectedDate.label,
        time: String(selectedTime),
        duration: String(duration),
        totalPrice,
      });

      Alert.alert("Booking updated");
      router.replace("/(tabs)/my-booking");
    } catch (err) {
      console.log(err);
      Alert.alert("Error updating booking");
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <TouchableOpacity onPress={() => router.replace("/(tabs)/my-booking")} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Edit Booking</Text>
          <Text style={styles.name}>Update your slot</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose a field</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {fields.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => setSelectedFieldId(item.id)} style={{ width: 315, marginRight: 12 }}>
              <View style={selectedFieldId === item.id && styles.activeCard}>
                <FieldCard
                  id={item.id}
                  name={item.name}
                  location={item.location}
                  distance={item.distance}
                  price={item.price}
                  duration={item.duration}
                  rating={item.rating}
                  reviews={item.reviews}
                  availableNow={item.availableNow}
                  selectedSport={item.sport}
                  image={getFieldImage(item.imageKey)}
                  disablePress
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.title}>Select date</Text>
        <View style={styles.row}>{dates.map((d) => <Chip key={d.label} label={d.label} active={selectedDate?.label === d.label} onPress={() => setSelectedDate(d)} />)}</View>

        <Text style={styles.title}>Select time</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowTimePicker(!showTimePicker)}>
          <Text style={styles.dropdownText}>{selectedTime !== null ? formatTime(selectedTime) : "Choose time"}</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <View style={styles.dropdownList}>
            {timeSlots.map((time) => (
              <TouchableOpacity key={time.value} style={styles.dropdownItem} onPress={() => { setSelectedTime(time.value); setShowTimePicker(false); }}>
                <Text>{time.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.title}>Duration</Text>
        <View style={styles.row}>{[1, 2, 3].map((h) => <Chip key={h} label={`${h} hr`} active={duration === h} onPress={() => setDuration(h)} />)}</View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryLine}>Field: {selectedField?.name || "-"}</Text>
          <Text style={styles.summaryLine}>Date: {selectedDate?.label || "-"}</Text>
          <Text style={styles.summaryLine}>Time: {selectedTime !== null ? formatTime(selectedTime) : "-"}</Text>
          <Text style={styles.summaryLine}>Duration: {duration} hr</Text>
          <Text style={styles.total}>₪ {totalPrice}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.active]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 22, paddingHorizontal: 16, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { color: "#D8F7E7", fontWeight: "700" },
  name: { color: "#fff", fontSize: 24, fontWeight: "900" },
  avatar: { width: 44, height: 44, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontWeight: "bold" },
  container: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 18, fontWeight: "900", marginTop: 12, marginBottom: 10, color: COLORS.text },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#E5E7EB", borderRadius: 20 },
  chipText: { color: COLORS.text, fontWeight: "800" },
  active: { backgroundColor: COLORS.primary },
  activeText: { color: "#fff" },
  dropdown: { backgroundColor: "#fff", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  dropdownText: { color: COLORS.text, fontWeight: "700" },
  dropdownList: { backgroundColor: "#fff", borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  summary: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginTop: 20, borderWidth: 1, borderColor: COLORS.border },
  summaryTitle: { fontWeight: "900", marginBottom: 10, fontSize: 17 },
  summaryLine: { color: COLORS.subText, fontWeight: "700", marginBottom: 5 },
  total: { marginTop: 10, fontWeight: "900", fontSize: 22, color: COLORS.primary },
  button: { marginTop: 20, backgroundColor: COLORS.primary, padding: 17, borderRadius: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "900" },
  activeCard: { borderWidth: 3, borderColor: COLORS.primary, borderRadius: 20, padding: 3 },
  backButton: { position: "absolute", top: 50, left: 16, width: 45, height: 45, borderRadius: 999, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", zIndex: 10 },
});
