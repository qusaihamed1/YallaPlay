import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/colors";

type Props = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export default function SportChip({ label, active, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.sportChip, active && styles.sportChipActive]}
    >
      <Text style={[styles.sportChipText, active && styles.sportChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sportChip: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  sportChipActive: {
    backgroundColor: COLORS.primary,
  },
  sportChipText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  sportChipTextActive: {
    color: COLORS.white,
  },
});