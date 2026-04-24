import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

<<<<<<< HEAD
const { width, height } = Dimensions.get("window");
=======
const { height } = Dimensions.get("window");
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9

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
<<<<<<< HEAD
    width: width * 0.58,
    height: width * 0.58,
    borderRadius: 999,
    backgroundColor: "#DFF3E8",
    top: -width * 0.12,
    right: -width * 0.16,
=======
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#DFF3E8",
    top: -50,
    right: -70,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    opacity: 0.9,
  },

  bgCircleBottom: {
    position: "absolute",
<<<<<<< HEAD
    width: width * 0.54,
    height: width * 0.54,
    borderRadius: 999,
    backgroundColor: "#EAF7EF",
    bottom: -width * 0.18,
    left: -width * 0.18,
=======
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#EAF7EF",
    bottom: -60,
    left: -70,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  },

  bgCircleSmall: {
    position: "absolute",
<<<<<<< HEAD
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: 999,
    backgroundColor: "#D9EEE0",
    top: height * 0.22,
    left: width * 0.08,
=======
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#D9EEE0",
    top: height * 0.23,
    left: 30,
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
    opacity: 0.8,
  },
});