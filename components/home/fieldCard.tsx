import { router } from "expo-router";
<<<<<<< HEAD
=======
import React from "react";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
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
<<<<<<< HEAD
=======
import { SportType } from "../../types/home";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9

const { width } = Dimensions.get("window");
const cardRadius = 16;

type Props = {
  name: string;
  distance: string;
  price: string;
  rating: string;
  availableNow?: boolean;
<<<<<<< HEAD
  selectedSport: string;
  image?: ImageSourcePropType;
  disablePress?: boolean;
  
=======
  selectedSport: SportType;
  image?: ImageSourcePropType;
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
};

export default function FieldCard({
  name,
  distance,
  price,
  rating,
  availableNow,
  selectedSport,
  image,
<<<<<<< HEAD
  disablePress,
=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
}: Props) {
  const handlePress = () => {
    if (name === "Nablus Municipality Stadium") {
      router.push("/Nablus-Stadium");
      return;
    }

    if (name === "Al-Salahiyya School") {
      router.push("/Al-Salahiyya-School");
    }
  };

  const isClickable =
    name === "Nablus Municipality Stadium" || name === "Al-Salahiyya School";

<<<<<<< HEAD
  if (disablePress) {
    return (
      <View style={styles.card}>
        {image ? (
          <Image source={image} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={styles.heroImagePlaceholder}>
            <Text style={styles.heroPlaceholderText}>
              {selectedSport === "basketball" ? "Court Image" : "Field Image"}
            </Text>
          </View>
        )}

        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.cardPrice}>{price}</Text>
        </View>

        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMeta}>{distance}</Text>
          <Text style={styles.cardMeta}>★ {rating}</Text>
        </View>

        {availableNow && (
          <View style={styles.badgeAvailable}>
            <Text style={styles.badgeAvailableText}>Available now</Text>
          </View>
        )}
      </View>
    );
  }

=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  return (
    <TouchableOpacity
      activeOpacity={isClickable ? 0.85 : 1}
      onPress={isClickable ? handlePress : undefined}
      style={styles.card}
    >
      {image ? (
        <Image source={image} style={styles.heroImage} resizeMode="cover" />
      ) : (
        <View style={styles.heroImagePlaceholder}>
          <Text style={styles.heroPlaceholderText}>
            {selectedSport === "basketball" ? "Court Image" : "Field Image"}
          </Text>
        </View>
      )}

      <View style={styles.cardTitleRow}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.cardPrice}>{price}</Text>
      </View>

      <View style={styles.cardMetaRow}>
        <Text style={styles.cardMeta}>{distance}</Text>
        <Text style={styles.cardMeta}>★ {rating}</Text>
      </View>

      {availableNow && (
        <View style={styles.badgeAvailable}>
          <Text style={styles.badgeAvailableText}>Available now</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
<<<<<<< HEAD
  backgroundColor: COLORS.white,
  borderRadius: cardRadius,
  borderWidth: 1,
  borderColor: COLORS.border,
  padding: 12,
},
=======
    backgroundColor: COLORS.white,
    borderRadius: cardRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
  },
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  heroImage: {
    width: "100%",
    height: width * 0.38,
    borderRadius: 14,
    marginBottom: 12,
  },
  heroImagePlaceholder: {
    width: "100%",
    height: width * 0.38,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroPlaceholderText: {
    color: "#EAF7EF",
    fontSize: 16,
    fontWeight: "700",
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  },
  cardMeta: {
    fontSize: 13,
    color: COLORS.subText,
    fontWeight: "600",
  },
  badgeAvailable: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeAvailableText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },
});