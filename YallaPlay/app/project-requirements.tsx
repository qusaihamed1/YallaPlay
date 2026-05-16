import { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HookFormDemo from "../components/forms/HookFormDemo";
import { COLORS } from "../constants/colors";
import { useAppContext } from "../context/AppContext";
import { useDeviceLocation } from "../hooks/useDeviceLocation";
import { useFields } from "../hooks/useFields";
import { useOfflineBookings } from "../hooks/useOfflineBookings";

export default function ProjectRequirementsScreen() {
  const renderCounter = useRef(0);
  renderCounter.current += 1;

  const { favoriteSport, changeFavoriteSport } = useAppContext();
  const { data: fields = [], isLoading, isError } = useFields();
  const { location, loadingLocation, locationError, requestLocation } = useDeviceLocation();
  const { offlineBookings, addOfflineBooking } = useOfflineBookings();

  const footballCount = useMemo(
    () => fields.filter((field) => field.sport === "football").length,
    [fields]
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Project Requirements</Text>
        <Text style={styles.headerSub}>Demo page for discussion</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>TanStack Query + Axios</Text>
          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : isError ? (
            <Text style={styles.error}>Could not load fields from backend.</Text>
          ) : (
            <Text style={styles.text}>Loaded {fields.length} fields from backend. Football fields: {footballCount}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Context API + Async Storage</Text>
          <Text style={styles.text}>Favorite sport: {favoriteSport}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.smallButton} onPress={() => changeFavoriteSport("football")}>
              <Text style={styles.buttonText}>Football</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => changeFavoriteSport("basketball")}>
              <Text style={styles.buttonText}>Basketball</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Device Feature: Location</Text>
          {location ? (
            <Text style={styles.text}>Lat: {location.latitude.toFixed(4)} / Lng: {location.longitude.toFixed(4)}</Text>
          ) : (
            <Text style={styles.text}>Location not loaded yet.</Text>
          )}
          {!!locationError && <Text style={styles.error}>{locationError}</Text>}
          <TouchableOpacity style={styles.button} onPress={requestLocation}>
            <Text style={styles.buttonText}>{loadingLocation ? "Loading..." : "Get My Location"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>SQLite Offline Bookings</Text>
          <TouchableOpacity style={styles.button} onPress={() => addOfflineBooking()}>
            <Text style={styles.buttonText}>Add Offline Booking</Text>
          </TouchableOpacity>
          {offlineBookings.map((booking) => (
            <Text key={booking.id} style={styles.text}>
              {booking.fieldName} - {booking.date} - {booking.time}
            </Text>
          ))}
        </View>

        <HookFormDemo />

        <View style={styles.card}>
          <Text style={styles.title}>useRef</Text>
          <Text style={styles.text}>Render counter: {renderCounter.current}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: "800" },
  headerSub: { color: "#D8F7E7", marginTop: 4 },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { color: COLORS.text, fontSize: 16, fontWeight: "800", marginBottom: 8 },
  text: { color: COLORS.subText, marginBottom: 6, fontWeight: "600" },
  error: { color: "#B00020", marginTop: 6 },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  smallButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: { color: COLORS.white, fontWeight: "800" },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
});
