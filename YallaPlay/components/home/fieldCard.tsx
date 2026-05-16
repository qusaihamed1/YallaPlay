import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { SportType } from "../../types/home";

const { width } = Dimensions.get("window");
const cardRadius = 18;

type Props = {
  id?: string;
  name: string;
  location?: string;
  distance: string;
  price: string | number;
  duration?: string;
  rating: string | number;
  reviews?: string | number;
  availableNow?: boolean;
  selectedSport: SportType;
  image?: ImageSourcePropType;
  disablePress?: boolean;
  onPress?: () => void;
};

export default function FieldCard({
  id,
  name,
  location,
  distance,
  price,
  duration,
  rating,
  reviews,
  availableNow,
  selectedSport,
  image,
  disablePress,
  onPress,
}: Props) {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (id) {
      router.push({ pathname: "/field/[id]", params: { id } });
    }
  };

  const cardContent = (
    <>
      <View style={styles.imageWrapper}>
        {image ? (
          <Image source={image} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={styles.heroImagePlaceholder}>
            <Text style={styles.heroPlaceholderText}>
              {selectedSport === "basketball" ? "Court Image" : "Field Image"}
            </Text>
          </View>
        )}

        {availableNow && (
          <View style={styles.floatingBadge}>
            <Text style={styles.floatingBadgeText}>Available now</Text>
          </View>
        )}
      </View>

      <View style={styles.cardTitleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {name}
          </Text>
          {!!location && <Text style={styles.location}>{location}</Text>}
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.cardPrice}>₪{price}</Text>
          {!!duration && <Text style={styles.duration}>{duration}</Text>}
        </View>
      </View>

      <View style={styles.cardMetaRow}>
        <Text style={styles.cardMeta}>📍 {distance}</Text>
        <Text style={styles.cardMeta}>★ {rating}{reviews ? ` (${reviews})` : ""}</Text>
      </View>
    </>
  );

  if (disablePress) {
    return <View style={styles.card}>{cardContent}</View>;
  }

  return (
    <TouchableOpacity activeOpacity={0.86} onPress={handlePress} style={styles.card}>
      {cardContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: cardRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  heroImage: {
    width: "100%",
    height: width * 0.38,
    borderRadius: 15,
  },
  heroImagePlaceholder: {
    width: "100%",
    height: width * 0.38,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  heroPlaceholderText: {
    color: "#EAF7EF",
    fontSize: 16,
    fontWeight: "700",
  },
  floatingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  floatingBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "800",
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  location: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.subText,
    fontWeight: "600",
  },
  priceBox: {
    alignItems: "flex-end",
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
  },
  duration: {
    color: COLORS.subText,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  cardMeta: {
    fontSize: 13,
    color: COLORS.subText,
    fontWeight: "700",
  },
});
