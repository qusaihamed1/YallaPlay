import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../Config/firebaseConfig";
import FieldCard from "../../components/home/fieldCard";
import { COLORS } from "../../constants/colors";
import { basketballFields, footballFields } from "../../data/fields";
import useUser from "../../hooks/useUser";

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export default function Explore() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState<"football" | "basketball">("football");
  const [setUserData] = useState<any>(null);
const userData = useUser();
const name = userData?.fullName || "User";
const avatarLetter = name.charAt(0).toUpperCase();
  // ✅ user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      setUserData({
        fullName: user.email?.split("@")[0] || "User",
      });
    });

    return unsubscribe;
  }, []);


  const allFields =
    selectedSport === "football" ? footballFields : basketballFields;

  const filtered = allFields.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Search</Text>
          <Text style={styles.name}>Find your field</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/profile")} style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      {/* 🔍 SEARCH */}
      <View style={styles.container}>
        <TextInput
          placeholder="Search fields..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        {/* 🏷️ FILTERS */}
        <View style={styles.filters}>
          <TouchableOpacity
            style={[
              styles.filter,
              selectedSport === "football" && styles.active,
            ]}
            onPress={() => setSelectedSport("football")}
          >
            <Text style={selectedSport === "football" && styles.activeText}>
              Football
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filter,
              selectedSport === "basketball" && styles.active,
            ]}
            onPress={() => setSelectedSport("basketball")}
          >
            <Text style={selectedSport === "basketball" && styles.activeText}>
              Basketball
            </Text>
          </TouchableOpacity>
        </View>

        {/* 📋 LIST */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <FieldCard
              name={item.name}
              distance={item.distance}
              price={item.price}
              rating={item.rating}
              availableNow={item.availableNow}
              selectedSport={selectedSport}
              image={item.image}
            />
          )}
        />
      </View>

      
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
    flex: 1,
    padding: 16,
  },
  search: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  filters: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },
  filter: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 20,
  },
  active: {
    backgroundColor: COLORS.primary,
  },
  activeText: {
    color: "#fff",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 72,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});