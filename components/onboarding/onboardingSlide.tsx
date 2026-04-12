import React from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { SlideItem } from "../../data/onboardingSlides";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#2E8B57",
  primaryLight: "#E6F4EA",
  text: "#1E1E1E",
  subText: "#6F6F6F",
  white: "#FFFFFF",
};

const CARD_WIDTH = width * 0.82;
const CARD_HEIGHT = height * 0.36;

export default function OnboardingSlide({
  item,
  index,
  scrollX,
}: {
  item: SlideItem;
  index: number;
  scrollX: Animated.Value;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.35, 1, 0.35],
    extrapolate: "clamp",
  });

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [40, 0, 40],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.slide}>
      <Animated.View
        style={[
          styles.heroContainer,
          {
            opacity,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <View style={styles.heroGlow} />

        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>

          <View style={styles.iconWrapper}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>

          <View style={styles.miniCardRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Nearby</Text>
              <Text style={styles.miniCardValue}>12 Fields</Text>
            </View>

            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Available</Text>
              <Text style={styles.miniCardValue}>Today</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  heroContainer: {
    marginTop: 10,
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  heroGlow: {
    position: "absolute",
    width: CARD_WIDTH + 30,
    height: CARD_HEIGHT + 30,
    backgroundColor: "#DFF3E7",
    borderRadius: 40,
    opacity: 0.9,
  },

  heroCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  badge: {
    position: "absolute",
    top: 18,
    left: 18,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  iconWrapper: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  emoji: {
    fontSize: 56,
  },

  miniCardRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  miniCard: {
    backgroundColor: "#F8F8F8",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    minWidth: 110,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  miniCardLabel: {
    fontSize: 12,
    color: COLORS.subText,
    marginBottom: 4,
  },

  miniCardValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.text,
    marginBottom: 14,
    lineHeight: 38,
  },

  description: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.subText,
    lineHeight: 25,
    maxWidth: 310,
  },
});