import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FieldCard from "../../components/home/fieldCard";
import { COLORS } from "../../constants/colors";
import { basketballFields, footballFields } from "../../data/fields";
import useUser from "../../hooks/useUser";

export default function Explore() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState<"football" | "basketball">("football");

  const userData = useUser();
  const name = userData?.fullName || "User";
  const avatarLetter = name.charAt(0).toUpperCase();

  const allFields =
    selectedSport === "football" ? footballFields : basketballFields;

  const filtered = allFields.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Search</Text>
          <Text style={styles.name}>Find your field</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TextInput
          placeholder="Search fields..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        <View style={styles.filters}>
          <TouchableOpacity
            style={[
              styles.filter,
              selectedSport === "football" && styles.active,
            ]}
            onPress={() => setSelectedSport("football")}
          >
            <Text
              style={[
                styles.filterText,
                selectedSport === "football" && styles.activeText,
              ]}
            >
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
            <Text
              style={[
                styles.filterText,
                selectedSport === "basketball" && styles.activeText,
              ]}
            >
              Basketball
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
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
          ListEmptyComponent={
            <Text style={styles.emptyText}>No fields found.</Text>
          }
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    borderRadius: 20,
  },
  filterText: {
    color: "#222",
    fontWeight: "600",
  },
  active: {
    backgroundColor: COLORS.primary,
  },
  activeText: {
    color: "#fff",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
    fontSize: 16,
  },
});