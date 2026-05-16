import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../Config/firebaseConfig";
import FieldCard from "../../components/home/fieldCard";
import { COLORS } from "../../constants/colors";
import { SPORTS } from "../../constants/sports";
import { useFields } from "../../hooks/useFields";
import { SportType } from "../../types/home";
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

export default function Booking() {
  const params = useLocalSearchParams<{ fieldId?: string; sport?: SportType }>();
  const router = useRouter();
  const { data: fields = [], isLoading: loadingFields } = useFields();

  const [userData, setUserData] = useState<any>(null);
  const [selectedSport, setSelectedSport] = useState<SportType>(params.sport || "football");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(params.fieldId || null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      } else {
        setUserData({ fullName: user.email?.split("@")[0] || "User" });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (params.sport) setSelectedSport(params.sport);
    if (params.fieldId) setSelectedFieldId(params.fieldId);
  }, [params.fieldId, params.sport]);

  const avatarLetter = getFirstLetter(userData?.fullName || "User");
  const profileImage = userData?.photoUri || null;

  const displayedFields = useMemo(
    () => fields.filter((field) => field.sport === selectedSport),
    [fields, selectedSport]
  );

  const selectedField = useMemo(
    () => displayedFields.find((field) => field.id === selectedFieldId) || null,
    [displayedFields, selectedFieldId]
  );

  const dates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push({
        label: d.toLocaleDateString(),
        value: d,
      });
    }
    return arr;
  }, []);

  const timeSlots = useMemo(() => {
    const times = [];
    for (let i = 8; i <= 23; i++) {
      times.push({ label: formatTime(i), value: i });
    }
    return times;
  }, []);

  const totalPrice = selectedField ? Number(selectedField.price) * duration : 0;

  const handleSportChange = useCallback((sport: SportType) => {
    setSelectedSport(sport);
    setSelectedFieldId(null);
  }, []);

  const handleConfirm = () => {
    if (!selectedField || !selectedDate || selectedTime === null) {
      Alert.alert("Missing info", "Please choose a field, date, and time.");
      return;
    }

    router.push({
      pathname: "/(tabs)/payment",
      params: {
        fieldId: selectedField.id,
        field: selectedField.name,
        date: selectedDate.label,
        time: selectedTime,
        duration,
        total: totalPrice,
      },
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Booking</Text>
          <Text style={styles.name}>Choose your slot</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.avatar}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose sport</Text>
        <View style={styles.row}>
          {SPORTS.map((sport) => (
            <Chip
              key={sport.value}
              label={`${sport.emoji} ${sport.label}`}
              active={selectedSport === sport.value}
              onPress={() => handleSportChange(sport.value)}
            />
          ))}
        </View>

        <Text style={styles.title}>Choose a field</Text>

        {loadingFields ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <FlatList
            horizontal
            data={displayedFields}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedFieldId(item.id)} style={styles.fieldItem} activeOpacity={0.9}>
                <View style={[styles.fieldCardWrap, selectedFieldId === item.id && styles.selectedCard]}>
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
            )}
          />
        )}

        <Text style={styles.title}>Select date</Text>
        <View style={styles.row}>
          {dates.map((d) => (
            <Chip key={d.label} label={d.label} active={selectedDate?.label === d.label} onPress={() => setSelectedDate(d)} />
          ))}
        </View>

        <Text style={styles.title}>Select time</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowTimePicker(!showTimePicker)}>
          <Text style={styles.dropdownText}>{selectedTime !== null ? formatTime(selectedTime) : "Choose time"}</Text>
          <Ionicons name={showTimePicker ? "chevron-up" : "chevron-down"} size={18} color={COLORS.subText} />
        </TouchableOpacity>

        {showTimePicker && (
          <View style={styles.dropdownList}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time.value}
                style={styles.dropdownItem}
                onPress={() => {
                  if (!selectedDate) {
                    Alert.alert("Choose date first");
                    return;
                  }

                  const now = new Date();
                  if (selectedDate.value.toDateString() === now.toDateString() && time.value <= now.getHours()) {
                    Alert.alert("Time already passed");
                    return;
                  }

                  setSelectedTime(time.value);
                  setShowTimePicker(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{time.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.title}>Duration</Text>
        <View style={styles.row}>
          {[1, 2, 3].map((h) => (
            <Chip key={h} label={`${h} hr`} active={duration === h} onPress={() => setDuration(h)} />
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.summaryLine}>Field: {selectedField?.name || "-"}</Text>
          <Text style={styles.summaryLine}>Date: {selectedDate?.label || "-"}</Text>
          <Text style={styles.summaryLine}>Time: {selectedTime !== null ? formatTime(selectedTime) : "-"}</Text>
          <Text style={styles.summaryLine}>Duration: {duration} hr</Text>
          <Text style={styles.total}>₪ {totalPrice}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm & Pay</Text>
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
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { color: "#D8F7E7", fontSize: 14, fontWeight: "700" },
  name: { color: "#fff", fontSize: 24, fontWeight: "900" },
  avatar: { width: 44, height: 44, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImage: { width: "100%", height: "100%" },
  avatarText: { color: "#fff", fontWeight: "bold" },
  container: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 18, fontWeight: "900", marginBottom: 10, marginTop: 12, color: COLORS.text },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#E5E7EB", borderRadius: 20 },
  chipText: { color: COLORS.text, fontWeight: "800" },
  active: { backgroundColor: COLORS.primary },
  activeText: { color: "#fff" },
  fieldItem: { width: 315, marginRight: 12 },
  fieldCardWrap: { borderRadius: 20 },
  selectedCard: { borderWidth: 3, borderColor: COLORS.primary, padding: 3 },
  summary: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginTop: 20, borderWidth: 1, borderColor: COLORS.border },
  summaryTitle: { fontWeight: "900", marginBottom: 10, fontSize: 17 },
  summaryLine: { color: COLORS.subText, fontWeight: "700", marginBottom: 5 },
  total: { marginTop: 10, fontWeight: "900", fontSize: 22, color: COLORS.primary },
  button: { marginTop: 20, backgroundColor: COLORS.primary, padding: 17, borderRadius: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  dropdown: { backgroundColor: "#fff", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dropdownText: { color: COLORS.text, fontWeight: "700" },
  dropdownList: { backgroundColor: "#fff", borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  dropdownItem: { padding: 13, borderBottomWidth: 1, borderColor: "#eee" },
  dropdownItemText: { color: COLORS.text, fontWeight: "700" },
});
