import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FieldCard from "../../components/home/fieldCard";
import { COLORS } from "../../constants/colors";
import { SPORTS } from "../../constants/sports";
import { useFields } from "../../hooks/useFields";
import useUser from "../../hooks/useUser";
import { getFieldImage } from "../../utils/fieldImages";
import { SportType } from "../../types/home";

export default function Explore() {
  const router = useRouter();
  const { data: fields = [], isLoading, isError, refetch } = useFields();
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState<"all" | SportType>("all");

  const userData = useUser();
  const name = userData?.fullName || userData?.email || "User";
  const avatarLetter = name.charAt(0).toUpperCase();
  const profileImage = userData?.photoUri || null;

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim();

    return fields.filter((field) => {
      const sportMatch = selectedSport === "all" || field.sport === selectedSport;
      const searchMatch =
        !text ||
        field.name.toLowerCase().includes(text) ||
        field.location.toLowerCase().includes(text) ||
        field.description.toLowerCase().includes(text);

      return sportMatch && searchMatch;
    });
  }, [fields, search, selectedSport]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Search</Text>
          <Text style={styles.name}>Discover fields</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.avatar}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.mutedIcon} />
          <TextInput
            placeholder="Search by name, location, or description..."
            placeholderTextColor={COLORS.mutedIcon}
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={styles.filtersContent}
        >
          <Filter label="All" active={selectedSport === "all"} onPress={() => setSelectedSport("all")} />
          {SPORTS.map((sport) => (
            <Filter
              key={sport.value}
              label={`${sport.emoji} ${sport.label}`}
              active={selectedSport === sport.value}
              onPress={() => setSelectedSport(sport.value)}
            />
          ))}
        </ScrollView>

        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : isError ? (
          <TouchableOpacity style={styles.centerBox} onPress={() => refetch()}>
            <Text style={styles.emptyText}>Could not load fields. Tap to retry.</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
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
              />
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No fields found.</Text>}
          />
        )}
      </View>
    </View>
  );
}

function Filter({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.filter, active && styles.active]} onPress={onPress}>
      <Text style={[styles.filterText, active && styles.activeText]}>{label}</Text>
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
  avatarText: { color: "#fff", fontWeight: "900" },
  container: { flex: 1, paddingTop: 16 },
  searchBox: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 14,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  search: { flex: 1, paddingVertical: 13, color: COLORS.text },
  filters: { marginBottom: 16 },
  filtersContent: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingRight: 32 },
  filter: { paddingVertical: 9, paddingHorizontal: 14, backgroundColor: "#E5E7EB", borderRadius: 999, minHeight: 38, justifyContent: "center" },
  filterText: { color: "#222", fontWeight: "800", fontSize: 12 },
  active: { backgroundColor: COLORS.primary },
  activeText: { color: "#fff" },
  centerBox: { padding: 28, backgroundColor: "#fff", borderRadius: 16, alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 24, color: COLORS.subText, fontSize: 16, fontWeight: "700" },
});
