import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primaryLight: "#E6F4EA",
};

export default function BackgroundDecor() {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, {
          toValue: 1,
          duration: 4500,
          useNativeDriver: true,
        }),
        Animated.timing(float2, {
          toValue: 0,
          duration: 4500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [float1, float2]);

  const translateY1 = float1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const translateY2 = float2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.bgCircle,
          styles.bgCircleOne,
          { transform: [{ translateY: translateY1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle,
          styles.bgCircleTwo,
          { transform: [{ translateY: translateY2 }] },
        ]}
      />
      <View style={styles.bgCircleThree} />
    </>
  );
}

const styles = StyleSheet.create({
  bgCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },

  bgCircleOne: {
    width: width * 0.44,
    height: width * 0.44,
    top: height * 0.1,
    right: -width * 0.1,
  },

  bgCircleTwo: {
    width: width * 0.3,
    height: width * 0.3,
    bottom: height * 0.22,
    left: -width * 0.08,
  },

  bgCircleThree: {
    position: "absolute",
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 999,
    backgroundColor: "#D9EEE0",
    top: height * 0.23,
    left: width * 0.08,
    opacity: 0.8,
  },
});