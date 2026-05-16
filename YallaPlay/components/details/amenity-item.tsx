import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function AmenityItem({ label }: { label: string }) {
  return (
    <View style={styles.amenityItem}>
      <Text style={styles.amenityText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  amenityItem: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  amenityText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
});