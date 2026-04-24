<<<<<<< HEAD
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
=======
import React from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#2E8B57",
  subText: "#6F6F6F",
  white: "#FFFFFF",
};

export default function OnboardingFooter({
  count,
  currentIndex,
  scrollX,
  onNext,
}: {
  count: number;
  currentIndex: number;
  scrollX: Animated.Value;
  onNext: () => void;
}) {
  return (
    <View style={styles.footer}>
      <View style={styles.dotsRow}>
        {Array.from({ length: count }).map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 28, 10],
            extrapolate: "clamp",
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                },
              ]}
            />
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onNext}
        activeOpacity={0.9}
      >
        <Text style={styles.primaryButtonText}>
          {currentIndex === count - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.bottomHint}>
        Reserve faster. Play smarter. Enjoy more.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
<<<<<<< HEAD
    paddingHorizontal: width * 0.06,
=======
    paddingHorizontal: 24,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    paddingBottom: 28,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  dot: {
    height: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    marginHorizontal: 5,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  primaryButtonText: {
    color: COLORS.white,
<<<<<<< HEAD
    fontSize: Math.min(width * 0.04, 16),
=======
    fontSize: 16,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    fontWeight: "800",
  },

  bottomHint: {
    textAlign: "center",
    color: COLORS.subText,
    marginTop: 14,
<<<<<<< HEAD
    fontSize: Math.min(width * 0.033, 13),
=======
    fontSize: 13,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  },
});