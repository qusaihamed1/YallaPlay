import { Ionicons } from "@expo/vector-icons";
<<<<<<< HEAD
=======
import React from "react";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";

type Props = {
  label: string;
  active?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
<<<<<<< HEAD
  onPress?: () => void;
};

export default function BottomTab({ label, active, iconName, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.tabItem} activeOpacity={0.8} onPress={onPress}>
=======
};

export default function BottomTab({ label, active, iconName }: Props) {
  return (
    <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
      <View style={styles.tabIconContainer}>
        <Ionicons
          name={iconName}
          size={20}
          color={active ? COLORS.primary : COLORS.mutedIcon}
        />
      </View>

      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconContainer: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.mutedIcon,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
});