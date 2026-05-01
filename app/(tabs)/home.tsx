import { useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
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
import SportChip from "../../components/home/sportChip";
import { COLORS } from "../../constants/colors";
import { basketballFields, footballFields } from "../../data/fields";
import { SportType, UserData } from "../../types/home";

const { width } = Dimensions.get("window");
const horizontalPadding = width * 0.05;

function getFirstLetter(name: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

export default function HomeScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedSport, setSelectedSport] = useState<SportType>("football");
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
        (error) => {
          console.log("Error fetching user:", error);

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

  const fullName = userData?.fullName?.trim() || "User";
  const firstName = fullName.split(" ")[0];
  const avatarLetter = getFirstLetter(fullName);

  const displayedFields = useMemo(() => {
    const fields = selectedSport === "football" ? footballFields : basketballFields;
    const searchText = search.trim().toLowerCase();

    if (!searchText) return fields;

    return fields.filter((field) =>
      field.name.toLowerCase().includes(searchText)
    );
  }, [selectedSport, search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Welcome,</Text>

            {loadingUser ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
            ) : (
              <Text style={styles.name} numberOfLines={1}>
                {firstName}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search fields, sports..."
              placeholderTextColor={COLORS.mutedIcon}
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <Text style={styles.sectionTitle}>Sport type</Text>

          <View style={styles.sportRow}>
            <SportChip
              label="Football"
              active={selectedSport === "football"}
              onPress={() => setSelectedSport("football")}
            />
            <SportChip
              label="Basketball"
              active={selectedSport === "basketball"}
              onPress={() => setSelectedSport("basketball")}
            />
          </View>

          <Text style={styles.sectionTitle}>
            {selectedSport === "football" ? "Nearby fields" : "Nearby courts"}
          </Text>

          {displayedFields.map((field) => (
            <FieldCard
              key={`${selectedSport}-${field.id}`}
              name={field.name}
              distance={field.distance}
              price={field.price}
              rating={field.rating}
              availableNow={field.availableNow}
              selectedSport={selectedSport}
              image={field.image}
            />
          ))}

          {displayedFields.length === 0 && (
            <Text style={styles.emptyText}>No fields found.</Text>
          )}
        </ScrollView>

  
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: horizontalPadding,
    paddingTop: 10,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    color: "#D8F7E7",
    fontSize: 14,
    fontWeight: "600",
  },
  loader: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  name: {
    color: COLORS.white,
    fontSize: width * 0.075,
    fontWeight: "800",
    marginTop: 2,
  },
  avatar: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontWeight: "700",
  },
  scrollContent: {
    padding: horizontalPadding,
    paddingBottom: 24,
  },
  searchBox: {
    marginTop: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    marginBottom: 18,
    justifyContent: "center",
    minHeight: 50,
  },
  searchInput: {
    color: COLORS.text,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  sportRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.subText,
    fontSize: 15,
  },
  bottomNav: {
    height: 72,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
});