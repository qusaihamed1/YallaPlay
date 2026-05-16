import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function QuickStats({ fieldsCount, favoritesCount }: { fieldsCount: number; favoritesCount: number }) {
  const items = [
    { label: "Venues", value: String(fieldsCount || 0) },
    { label: "Favorites", value: String(favoritesCount || 0) },
    { label: "Support", value: "24/7" },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  value: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "900",
  },
  label: {
    color: COLORS.subText,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 3,
  },
});
