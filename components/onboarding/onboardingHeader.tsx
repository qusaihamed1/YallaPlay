<<<<<<< HEAD
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
=======
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9

const COLORS = {
  primary: "#2E8B57",
  white: "#FFFFFF",
};

export default function OnboardingHeader({
  onSkip,
}: {
  onSkip: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.logoPill}>
        <Text style={styles.logoBall}>⚽</Text>
        <Text style={styles.logoText}>
          Yalla <Text style={{ color: "#2E8B57" }}>Play</Text>
        </Text>
      </View>

      <TouchableOpacity onPress={onSkip} activeOpacity={0.8}>
        <Text style={styles.skip}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
<<<<<<< HEAD
    paddingHorizontal: width * 0.06,
=======
    paddingHorizontal: 22,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    paddingTop: 4,
  },

  logoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  logoBall: {
<<<<<<< HEAD
    fontSize: Math.min(width * 0.045, 16),
=======
    fontSize: 16,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    marginRight: 8,
  },

  logoText: {
<<<<<<< HEAD
    fontSize: Math.min(width * 0.04, 15),
=======
    fontSize: 15,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    fontWeight: "700",
    color: COLORS.primary,
  },

  skip: {
<<<<<<< HEAD
    fontSize: Math.min(width * 0.04, 15),
=======
    fontSize: 15,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    fontWeight: "700",
    color: COLORS.primary,
  },
});