import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function HomeHero({
  onSearchPress,
  onLocationPress,
  loadingLocation,
}: {
  onSearchPress: () => void;
  onLocationPress: () => void;
  loadingLocation?: boolean;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.copyBox}>
        <Text style={styles.eyebrow}>Weekend ready</Text>
        <Text style={styles.title}>Find a pitch, lock a slot, invite your team.</Text>
        <Text style={styles.subtitle}>Fast reservations across nearby football fields and courts.</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.primaryAction} onPress={onSearchPress} activeOpacity={0.86}>
          <Ionicons name="search" size={17} color="#FFFFFF" />
          <Text style={styles.primaryText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryAction} onPress={onLocationPress} activeOpacity={0.86}>
          <Ionicons name={loadingLocation ? "navigate" : "location"} size={17} color={COLORS.primary} />
          <Text style={styles.secondaryText}>Nearby</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    overflow: "hidden",
  },
  copyBox: {
    maxWidth: "92%",
  },
  eyebrow: {
    color: "#D8F7E7",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "#E9FFF2",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 15,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  secondaryText: {
    color: COLORS.primary,
    fontWeight: "900",
  },
});
