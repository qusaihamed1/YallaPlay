import { router } from "expo-router";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AmenityItem from "../components/details/amenity-item";
import InfoChip from "../components/details/info-chip";
import { COLORS } from "../constants/colors";

const { width } = Dimensions.get("window");
const horizontalPadding = width * 0.05;

export default function BasketballDetailsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <Text style={styles.favoriteIcon}>♡</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={require("../assets/images/Al-Salahiyya-School.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.contentCard}>
            <Text style={styles.title}>Al-Salahiyya School</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>📍 Eastern Nablus</Text>
              <Text style={styles.metaText}>★★★★☆ 4.6</Text>
            </View>

            <Text style={styles.reviewsText}>(28 reviews)</Text>

            <View style={styles.chipsRow}>
              <InfoChip label="Basketball" />
              <InfoChip label="School Court" />
              <InfoChip label="East Nablus" />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.sectionText}>
                Al-Salahiyya School is located in the eastern area of Nablus.
                It is a secondary school for students from grades 10 to 12,
                and it includes a basketball court suitable for training sessions
                and friendly games.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>

              <View style={styles.amenitiesWrap}>
                <AmenityItem label="Basketball Court" />
                <AmenityItem label="School Yard" />
                <AmenityItem label="Seating Area" />
                <AmenityItem label="Easy Access" />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bottomRow}>
              <View>
                <Text style={styles.price}>₪110 / 1.5 hr</Text>
                <Text style={styles.taxText}>incl. VAT</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.bookButton}
                onPress={() => {}}
              >
                <Text style={styles.bookButtonText}>Book now</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    width: 70,
  },
  headerRight: {
    width: 70,
    alignItems: "flex-end",
  },
  favoriteIcon: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroImage: {
    width: "100%",
    height: width * 0.45,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    marginTop: -8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    minHeight: 500,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.subText,
    fontWeight: "600",
  },
  reviewsText: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.subText,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 16,
    marginBottom: 16,
  },
  section: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: COLORS.subText,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },
  amenitiesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  bottomRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },
  taxText: {
    fontSize: 13,
    color: COLORS.subText,
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 150,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },
});