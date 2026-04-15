import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

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
    width: width * 0.58,
    height: width * 0.58,
    borderRadius: 999,
    backgroundColor: "#DFF3E8",
    top: -width * 0.12,
    right: -width * 0.16,
    opacity: 0.9,
  },

  bgCircleBottom: {
    position: "absolute",
    width: width * 0.54,
    height: width * 0.54,
    borderRadius: 999,
    backgroundColor: "#EAF7EF",
    bottom: -width * 0.18,
    left: -width * 0.18,
  },

  bgCircleSmall: {
    position: "absolute",
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: 999,
    backgroundColor: "#D9EEE0",
    top: height * 0.22,
    left: width * 0.08,
    opacity: 0.8,
  },
});