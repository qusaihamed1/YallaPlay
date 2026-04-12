import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export default function BackgroundDecor() {
  return (
    <>
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />
      <View style={styles.bgCircleSmall} />
    </>
  );
}

const styles = StyleSheet.create({
  bgCircleTop: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#DFF3E8",
    top: -50,
    right: -70,
    opacity: 0.9,
  },

  bgCircleBottom: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#EAF7EF",
    bottom: -60,
    left: -70,
  },

  bgCircleSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#D9EEE0",
    top: height * 0.23,
    left: 30,
    opacity: 0.8,
  },
});