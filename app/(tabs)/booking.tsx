import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../Config/firebaseConfig";

import FieldCard from "../../components/home/fieldCard";
import { COLORS } from "../../constants/colors";
import { basketballFields, footballFields } from "../../data/fields";

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export default function Booking() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);

  const [selectedSport, setSelectedSport] = useState("football");
  const [selectedField, setSelectedField] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
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
        setUserData({
          fullName: user.email?.split("@")[0] || "User",
        });
      }
    });

    return unsubscribe;
  }, []);

  const avatarLetter = getFirstLetter(userData?.fullName || "User");

  const displayedFields = useMemo(() => {
    return selectedSport === "football"
      ? footballFields
      : basketballFields;
  }, [selectedSport]);

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

  const handleConfirm = () => {
    if (!selectedField || !selectedDate || selectedTime === null) {
      Alert.alert("Missing info", "Please select everything");
      return;
    }

    router.push({
      pathname: "/payment",
      params: {
        field: selectedField.name,
        date: selectedDate.label,
        time: selectedTime,
        duration: duration,
        total: totalPrice,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Booking</Text>
          <Text style={styles.name}>Choose your slot</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Choose sport</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.chip,
              selectedSport === "football" && styles.active,
            ]}
            onPress={() => {
              setSelectedSport("football");
              setSelectedField(null);
            }}
          >
            <Text style={selectedSport === "football" && styles.activeText}>
              ⚽ Football
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chip,
              selectedSport === "basketball" && styles.active,
            ]}
            onPress={() => {
              setSelectedSport("basketball");
              setSelectedField(null);
            }}
          >
            <Text style={selectedSport === "basketball" && styles.activeText}>
              🏀 Basketball
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Choose a field</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {displayedFields.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedField(item)}
              style={{ marginRight: 12 }}
            >
              <View
                style={
                  selectedField?.id === item.id && styles.selectedCard
                }
              >
                <FieldCard {...item} selectedSport={selectedSport} disablePress />
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
                  if (!selectedDate) {
                    Alert.alert("Choose date first");
                    return;
                  }

                  const now = new Date();

                  if (
                    selectedDate.value.toDateString() ===
                    now.toDateString()
                  ) {
                    if (time.value <= now.getHours()) {
                      Alert.alert("Time already passed");
                      return;
                    }
                  }

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
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          <Text>Field: {selectedField?.name || "-"}</Text>
          <Text>Date: {selectedDate?.label || "-"}</Text>
          <Text>
            Time:{" "}
            {selectedTime !== null
              ? timeSlots.find((t) => t.value === selectedTime)?.label
              : "-"}
          </Text>
          <Text>Duration: {duration} hr</Text>

          <Text style={styles.total}>₪ {totalPrice}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm & Pay</Text>
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
  greeting: {
    color: "#D8F7E7",
    fontSize: 14,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  active: {
    backgroundColor: COLORS.primary,
  },
  activeText: {
    color: "#fff",
  },
  summary: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  summaryTitle: {
    fontWeight: "800",
    marginBottom: 10,
  },
  total: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 18,
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
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    padding: 4,
  },
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
});