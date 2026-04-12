import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  primary: "#2E8B57",
  primaryLight: "#E6F4EA",
  text: "#111827",
  subText: "#6B7280",
};

export default function SplashAnimation({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const ballScale = useRef(new Animated.Value(0.2)).current;
  const ballRotate = useRef(new Animated.Value(0)).current;
  const ballTranslateY = useRef(new Animated.Value(80)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.3)).current;
  const ringOpacity = useRef(new Animated.Value(0.8)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const firstAnimation = Animated.parallel([
      Animated.timing(ballScale, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(2.5)),
        useNativeDriver: true,
      }),
      Animated.timing(ballTranslateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(ballRotate, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(ringScale, {
          toValue: 1.2,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringScale, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(ringOpacity, {
          toValue: 0.25,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0.15,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const secondAnimation = Animated.sequence([
      Animated.delay(650),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    const thirdAnimation = Animated.sequence([
      Animated.delay(2200),
      Animated.timing(flashOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(flashOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]);

    const progressAnimation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    firstAnimation.start();
    secondAnimation.start();
    thirdAnimation.start();
    progressAnimation.start();

    const timer = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => {
      clearTimeout(timer);
      ballScale.stopAnimation();
      ballRotate.stopAnimation();
      ballTranslateY.stopAnimation();
      logoOpacity.stopAnimation();
      logoTranslateY.stopAnimation();
      taglineOpacity.stopAnimation();
      ringScale.stopAnimation();
      ringOpacity.stopAnimation();
      flashOpacity.stopAnimation();
      progressAnim.stopAnimation();
    };
  }, [
    ballScale,
    ballRotate,
    ballTranslateY,
    logoOpacity,
    logoTranslateY,
    taglineOpacity,
    ringScale,
    ringOpacity,
    flashOpacity,
    progressAnim,
    onFinish,
  ]);

  const spin = ballRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.flash,
          {
            opacity: flashOpacity,
          },
        ]}
      />

      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.ring,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.ballWrapper,
            {
              transform: [
                { translateY: ballTranslateY },
                { scale: ballScale },
                { rotate: spin },
              ],
            },
          ]}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandText}>
            Yalla <Text style={styles.brandHighlight}>Play</Text>
          </Text>

          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: taglineOpacity,
              },
            ]}
          >
            Book fast. Play smart.
          </Animated.Text>
        </Animated.View>
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  ring: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: COLORS.primaryLight,
  },

  ballWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#EDF8F1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2E8B57",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },

  logoImage: {
    width: 125,
    height: 125,
    borderRadius: 62,
  },

  brandContainer: {
    alignItems: "center",
    marginTop: 28,
  },

  brandText: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 0.4,
  },

  brandHighlight: {
    color: COLORS.primary,
  },

  tagline: {
    marginTop: 10,
    fontSize: 15,
    color: COLORS.subText,
    fontWeight: "600",
  },

  bottomArea: {
    paddingHorizontal: 40,
    paddingBottom: 38,
  },

  loadingBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#D8EBDD",
    borderRadius: 999,
    overflow: "hidden",
  },

  loadingProgress: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
});