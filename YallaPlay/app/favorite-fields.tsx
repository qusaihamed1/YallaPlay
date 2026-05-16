import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FieldCard from "../components/home/fieldCard";
import { COLORS } from "../constants/colors";
import { useAppContext } from "../context/AppContext";
import { useFields } from "../hooks/useFields";
import { getFieldImage } from "../utils/fieldImages";

export default function FavoriteFieldsScreen() {
  const router = useRouter();
  const { favorites } = useAppContext();
  const { data: fields = [], isLoading, isError, refetch } = useFields();

  const favoriteFields = fields.filter((field) => favorites.includes(field.id));

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Favorite Fields</Text>
          <Text style={styles.subtitle}>Saved locally for quick booking</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : isError ? (
          <TouchableOpacity style={styles.emptyCard} onPress={() => refetch()} activeOpacity={0.85}>
            <Text style={styles.emptyTitle}>Could not load favorites</Text>
            <Text style={styles.emptySubtitle}>Tap to try again</Text>
          </TouchableOpacity>
        ) : favoriteFields.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>No favorite fields yet</Text>
            <Text style={styles.emptySubtitle}>Open any field details page and press the heart button to save it here.</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={() => router.push("/(tabs)/home")} activeOpacity={0.85}>
              <Text style={styles.exploreText}>Explore Fields</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favoriteFields.map((field) => (
            <FieldCard
              key={field.id}
              id={field.id}
              name={field.name}
              location={field.location}
              distance={field.distance}
              price={field.price}
              duration={field.duration}
              rating={field.rating}
              reviews={field.reviews}
              availableNow={field.availableNow}
              selectedSport={field.sport}
              image={getFieldImage(field.imageKey)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 58,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "900" },
  subtitle: { color: "#D8F7E7", fontSize: 13, marginTop: 3, fontWeight: "700" },
  content: { padding: 16, paddingBottom: 28 },
  loader: { marginTop: 40 },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    alignItems: "center",
    marginTop: 20,
  },
  emptyIcon: { fontSize: 34, marginBottom: 8 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: "900", textAlign: "center" },
  emptySubtitle: { color: COLORS.subText, fontSize: 13, textAlign: "center", lineHeight: 20, marginTop: 6 },
  exploreButton: { backgroundColor: COLORS.primary, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12, marginTop: 16 },
  exploreText: { color: "#fff", fontWeight: "900" },
});
