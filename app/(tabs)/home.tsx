<<<<<<< HEAD
import { useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
=======
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
<<<<<<< HEAD
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../Config/firebaseConfig";
=======
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../Config/firebaseConfig";
import BottomTab from "../../components/home/bottomTab";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedSport, setSelectedSport] = useState<SportType>("football");

<<<<<<< HEAD
  const router = useRouter();

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setUserData(null);
        setLoadingUser(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);

        unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            setUserData({
              fullName: user.email?.split("@")[0] || "User",
              email: user.email || "",
            });
          }

          setLoadingUser(false);
        });
      } catch (error) {
        console.log("Error fetching user:", error);

        setUserData({
          fullName: user.email?.split("@")[0] || "User",
          email: user.email || "",
        });

=======
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      try {
        if (!currentUser) {
          setUserData(null);
          setLoadingUser(false);
          return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          setUserData({
            fullName: currentUser.email?.split("@")[0] || "User",
            email: currentUser.email || "",
          });
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
        setUserData({
          fullName: currentUser?.email?.split("@")[0] || "User",
          email: currentUser?.email || "",
        });
      } finally {
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
        setLoadingUser(false);
      }
    });

<<<<<<< HEAD
    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeAuth();
    };
=======
    return unsubscribe;
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  }, []);

  const fullName = userData?.fullName?.trim() || "User";
  const firstName = fullName.split(" ")[0];
  const avatarLetter = getFirstLetter(fullName);

  const displayedFields = useMemo(() => {
    return selectedSport === "football" ? footballFields : basketballFields;
  }, [selectedSport]);

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

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
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
      </ScrollView>
    </View>
=======
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

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search fields, sports..."
              placeholderTextColor={COLORS.mutedIcon}
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
        </ScrollView>

        <View style={styles.bottomNav}>
          <BottomTab label="Home" active iconName="home" />
          <BottomTab label="Search" iconName="search-outline" />
          <BottomTab label="Bookings" iconName="calendar-outline" />
          <BottomTab label="Profile" iconName="person-outline" />
        </View>
      </View>
    </SafeAreaView>
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
=======
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
<<<<<<< HEAD

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingHorizontal: horizontalPadding,
=======
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: horizontalPadding,
    paddingTop: 10,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
<<<<<<< HEAD

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
<<<<<<< HEAD

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  greeting: {
    color: "#D8F7E7",
    fontSize: 14,
    fontWeight: "600",
  },
<<<<<<< HEAD

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  loader: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
<<<<<<< HEAD

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  name: {
    color: COLORS.white,
    fontSize: width * 0.075,
    fontWeight: "800",
    marginTop: 2,
  },
<<<<<<< HEAD

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  avatar: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
<<<<<<< HEAD

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  avatarText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontWeight: "700",
  },
<<<<<<< HEAD

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  scrollContent: {
    padding: horizontalPadding,
    paddingBottom: 24,
  },
<<<<<<< HEAD

=======
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
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
<<<<<<< HEAD

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  sportRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
<<<<<<< HEAD
=======
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
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
});