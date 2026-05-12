import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import TimeSlotChip from "../../components/details/TimeSlotChip";
import { getSportLabel } from "../../constants/sports";
import { useAppContext } from "../../context/AppContext";
import { getFieldById } from "../../services/fieldsService";
import { getFieldImage } from "../../utils/fieldImages";

export default function FieldDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavoriteField, toggleFavoriteField } = useAppContext();

  const { data: field, isLoading, isError, refetch } = useQuery({
    queryKey: ["field", id],
    queryFn: () => getFieldById(String(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError || !field) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load field details.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.imageHeader}>
          <Image source={getFieldImage(field.imageKey)} style={styles.heroImage} resizeMode="cover" />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteBtn} onPress={() => toggleFavoriteField(field.id)}>
            <Ionicons name={isFavoriteField(field.id) ? "heart" : "heart-outline"} size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imageOverlay} />
          <View style={styles.headerTextBox}>
            <Text style={styles.sportBadge}>{getSportLabel(field.sport)} place</Text>
            <Text style={styles.title}>{field.name}</Text>
            <Text style={styles.meta}>★ {field.rating} ({field.reviews} reviews) · {field.location}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.quickRow}>
            <View style={styles.quickCard}>
              <Text style={styles.quickLabel}>Price</Text>
              <Text style={styles.quickValue}>₪{field.price}</Text>
              <Text style={styles.quickSmall}>{field.duration}</Text>
            </View>
            <View style={styles.quickCard}>
              <Text style={styles.quickLabel}>Distance</Text>
              <Text style={styles.quickValue}>{field.distance}</Text>
              <Text style={styles.quickSmall}>from you</Text>
            </View>
            <View style={styles.quickCard}>
              <Text style={styles.quickLabel}>Status</Text>
              <Text style={[styles.quickValue, { fontSize: 14 }]}>{field.availableNow ? "Available" : "Busy"}</Text>
              <Text style={styles.quickSmall}>now</Text>
            </View>
          </View>

          <Section title="Description">
            <Text style={styles.paragraph}>{field.description}</Text>
          </Section>

          <Section title="Available slots today">
            <View style={styles.slotRow}>
              {(field.availableSlots || []).map((slot) => (
                <TimeSlotChip key={slot} value={slot} />
              ))}
            </View>
          </Section>

          <Section title="Best for">
            <View style={styles.tagsRow}>
              {(field.recommendedFor || []).map((item) => (
                <View key={item} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Location & Hours">
            <InfoLine icon="location-outline" text={field.address} />
            <InfoLine icon="time-outline" text={field.openingHours} />
            <InfoLine icon="layers-outline" text={field.surface || "Sports surface"} />
            <InfoLine icon="people-outline" text={field.capacity || "Team booking"} />
          </Section>

          <Section title="Amenities">
            <View style={styles.tagsRow}>
              {(field.amenities || []).map((item) => (
                <View key={item} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Rules">
            {(field.rules || []).map((rule) => (
              <InfoLine key={rule} icon="checkmark-circle-outline" text={rule} />
            ))}
          </Section>

          {!!field.cancellationPolicy && (
            <Section title="Cancellation">
              <InfoLine icon="shield-checkmark-outline" text={field.cancellationPolicy} />
            </Section>
          )}

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/booking",
                params: {
                  fieldId: field.id,
                  sport: field.sport,
                },
              })
            }
          >
            <Text style={styles.bookButtonText}>Book this field</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoLine({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={18} color={COLORS.primary} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  content: { backgroundColor: COLORS.background, paddingBottom: 30 },
  imageHeader: { height: 330, backgroundColor: COLORS.primary, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  favoriteBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  headerTextBox: { position: "absolute", left: 18, right: 18, bottom: 22, zIndex: 2 },
  sportBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    color: COLORS.primaryDark,
    fontWeight: "900",
    marginBottom: 10,
  },
  title: { color: "#fff", fontSize: 28, fontWeight: "900" },
  meta: { color: "#EAF7EF", marginTop: 6, fontWeight: "700" },
  body: { padding: 16, marginTop: -18, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: COLORS.background },
  quickRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  slotRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickCard: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  quickLabel: { color: COLORS.subText, fontSize: 12, fontWeight: "800" },
  quickValue: { color: COLORS.text, fontWeight: "900", fontSize: 18, marginTop: 4 },
  quickSmall: { color: COLORS.subText, fontSize: 11, marginTop: 2 },
  section: { backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: "900", marginBottom: 10 },
  paragraph: { color: COLORS.subText, lineHeight: 21, fontWeight: "600" },
  infoLine: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  infoText: { color: COLORS.subText, fontWeight: "700", flex: 1 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: COLORS.primaryLight, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  tagText: { color: COLORS.primaryDark, fontWeight: "800", fontSize: 12 },
  bookButton: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 17, alignItems: "center", marginTop: 4 },
  bookButtonText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background, padding: 20 },
  errorText: { color: COLORS.subText, fontWeight: "700", marginBottom: 12 },
  retryBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "800" },
});
