import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function TimeSlotChip({ value }: { value: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#EAF7EF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#CDEEDC",
  },
  text: {
    color: COLORS.primaryDark,
    fontWeight: "900",
    fontSize: 12,
  },
});
