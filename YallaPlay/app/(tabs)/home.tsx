import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../Config/firebaseConfig";
import FieldCard from "../../components/home/fieldCard";
import HomeHero from "../../components/home/HomeHero";
import QuickStats from "../../components/home/QuickStats";
import SportChip from "../../components/home/sportChip";
import { COLORS } from "../../constants/colors";
import { SPORTS, getSportLabel } from "../../constants/sports";
import { useAppContext } from "../../context/AppContext";
import { useDeviceLocation } from "../../hooks/useDeviceLocation";
import { useFields } from "../../hooks/useFields";
import { SportType, UserData } from "../../types/home";
import { getFieldImage } from "../../utils/fieldImages";

const { width } = Dimensions.get("window");
const horizontalPadding = width * 0.05;

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export default function HomeScreen() {
  const router = useRouter();
  const { favoriteSport, changeFavoriteSport, favorites } = useAppContext();
  const { data: fields = [], isLoading: loadingFields, isError, refetch } = useFields();
  const { location, loadingLocation, locationError, requestLocation } = useDeviceLocation();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedSport, setSelectedSport] = useState<SportType>(favoriteSport);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setUserData(null);
        setLoadingUser(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);

      unsubscribeFirestore = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            setUserData({
              fullName: user.email?.split("@")[0] || "User",
              email: user.email || "",
            });
          }

          setLoadingUser(false);
        },
        () => {
          setUserData({
            fullName: user.email?.split("@")[0] || "User",
            email: user.email || "",
          });
          setLoadingUser(false);
        }
      );
    });

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    setSelectedSport(favoriteSport);
  }, [favoriteSport]);

  const handleSportChange = useCallback(
    (sport: SportType) => {
      setSelectedSport(sport);
      changeFavoriteSport(sport);
    },
    [changeFavoriteSport]
  );

  const fullName = userData?.fullName?.trim() || "User";
  const firstName = fullName.split(" ")[0];
  const avatarLetter = getFirstLetter(fullName);

  const displayedFields = useMemo(() => {
    const filteredBySport = fields.filter((field) => field.sport === selectedSport);
    const searchText = search.trim().toLowerCase();

    if (!searchText) return filteredBySport;

    return filteredBySport.filter(
      (field) =>
        field.name.toLowerCase().includes(searchText) ||
        field.location.toLowerCase().includes(searchText)
    );
  }, [fields, selectedSport, search]);

  const featuredField = displayedFields[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Welcome back,</Text>
            {loadingUser ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
            ) : (
              <Text style={styles.name} numberOfLines={1}>{firstName}</Text>
            )}
            <Text style={styles.headerSubtitle}>Reserve faster. Play smarter. Enjoy more.</Text>
          </View>

          <TouchableOpacity style={styles.avatar} onPress={() => router.push("/(tabs)/profile")}>
            {userData?.photoUri ? (
              <Image source={{ uri: userData.photoUri }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <HomeHero
            onSearchPress={() => router.push("/(tabs)/explore")}
            onLocationPress={requestLocation}
            loadingLocation={loadingLocation}
          />

          <QuickStats fieldsCount={fields.length} favoritesCount={favorites.length} />

          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={COLORS.mutedIcon} />
            <TextInput
              placeholder="Search fields or locations..."
              placeholderTextColor={COLORS.mutedIcon}
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.locationCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationTitle}>Find fields near you</Text>
              <Text style={styles.locationText}>
                {location
                  ? `Lat: ${location.latitude.toFixed(3)} / Lng: ${location.longitude.toFixed(3)}`
                  : locationError || "Use your device location for nearby reservations."}
              </Text>
            </View>
            <TouchableOpacity style={styles.locationButton} onPress={requestLocation} disabled={loadingLocation}>
              {loadingLocation ? <ActivityIndicator color="#fff" /> : <Ionicons name="location" size={18} color="#fff" />}
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sport type</Text>
            <Text style={styles.sectionHint}>Saved preference</Text>
          </View>

          <View style={styles.sportRow}>
            {SPORTS.map((sport) => (
              <SportChip
                key={sport.value}
                label={`${sport.emoji} ${sport.label}`}
                active={selectedSport === sport.value}
                onPress={() => handleSportChange(sport.value)}
              />
            ))}
          </View>

          {featuredField && (
            <TouchableOpacity
              style={styles.featured}
              activeOpacity={0.88}
              onPress={() => router.push({ pathname: "/field/[id]", params: { id: featuredField.id } })}
            >
              <Text style={styles.featuredLabel}>Recommended today</Text>
              <Text style={styles.featuredTitle}>{featuredField.name}</Text>
              <Text style={styles.featuredMeta}>★ {featuredField.rating} · {featuredField.location} · ₪{featuredField.price}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Nearby {getSportLabel(selectedSport).toLowerCase()} places</Text>

          {loadingFields ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
          ) : isError ? (
            <TouchableOpacity style={styles.retryBox} onPress={() => refetch()}>
              <Text style={styles.emptyText}>Could not load fields. Tap to try again.</Text>
            </TouchableOpacity>
          ) : (
            <>
              {displayedFields.map((field) => (
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
              ))}

              {displayedFields.length === 0 && <Text style={styles.emptyText}>No fields found.</Text>}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: horizontalPadding,
    paddingTop: 10,
    paddingBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerLeft: { flex: 1, marginRight: 12 },
  greeting: { color: "#D8F7E7", fontSize: 14, fontWeight: "700" },
  loader: { marginTop: 8, alignSelf: "flex-start" },
  name: { color: COLORS.white, fontSize: width * 0.075, fontWeight: "900", marginTop: 2 },
  headerSubtitle: { color: "#E9FFF2", marginTop: 4, fontSize: 12, fontWeight: "600" },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarText: { color: COLORS.white, fontSize: width * 0.045, fontWeight: "800" },
  avatarImage: { width: "100%", height: "100%" },
  scrollContent: { padding: horizontalPadding, paddingBottom: 110 },
  searchBox: {
    marginTop: -8,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    marginBottom: 14,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14 },
  locationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationTitle: { color: COLORS.text, fontWeight: "900", fontSize: 15 },
  locationText: { color: COLORS.subText, marginTop: 4, fontSize: 12, fontWeight: "600" },
  locationButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  sectionTitle: { fontSize: 21, fontWeight: "900", color: COLORS.text, marginBottom: 12 },
  sectionHint: { color: COLORS.subText, fontSize: 11, marginBottom: 13, fontWeight: "700" },
  sportRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  featured: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  featuredLabel: { color: "#D8F7E7", fontSize: 12, fontWeight: "800" },
  featuredTitle: { color: "#fff", fontSize: 20, fontWeight: "900", marginTop: 5 },
  featuredMeta: { color: "#E9FFF2", marginTop: 6, fontWeight: "700" },
  retryBox: { backgroundColor: COLORS.white, borderRadius: 14, padding: 20 },
  emptyText: { textAlign: "center", marginTop: 20, color: COLORS.subText, fontSize: 15, fontWeight: "700" },
});
