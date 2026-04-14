import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#2E8B57",
  primaryLight: "#E6F4EA",
  background: "#F7F9F8",
  text: "#1E1E1E",
  subText: "#6F6F6F",
  white: "#FFFFFF",
  dot: "#CFCFCF",
  dark: "#0F172A",
};

const slides = [
  {
    id: "1",
    title: "Book your field easily",
    description:
      "Discover nearby stadiums, compare options, and reserve your field in seconds.",
    emoji: "⚽",
    badge: "Fast Booking",
  },
  {
    id: "2",
    title: "Choose the perfect time",
    description:
      "Pick the best time for your team and manage your reservation with ease.",
    emoji: "📅",
    badge: "Flexible Schedule",
  },
  {
    id: "3",
    title: "Get ready to play",
    description:
      "Confirm your booking, invite your friends, and enjoy your next match.",
    emoji: "🏟️",
    badge: "Ready to Play",
  },
];

type SlideItem = (typeof slides)[0];

function BackgroundDecor() {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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

function Slide({
  item,
  index,
  scrollX,
}: {
  item: SlideItem;
  index: number;
  scrollX: Animated.Value;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.35, 1, 0.35],
    extrapolate: "clamp",
  });

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [40, 0, 40],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.slide}>
      <Animated.View
        style={[
          styles.heroContainer,
          {
            opacity,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <View style={styles.heroGlow} />

        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>

          <View style={styles.iconWrapper}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>

          <View style={styles.miniCardRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Nearby</Text>
              <Text style={styles.miniCardValue}>12 Fields</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>Available</Text>
              <Text style={styles.miniCardValue}>Today</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList<SlideItem>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace("/login");
    }
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecor />

      <View style={styles.header}>
        <View style={styles.logoPill}>
          <Text style={styles.logoBall}>⚽</Text>
<Text style={styles.logoText}>
  Yalla <Text style={{ color: "#2E8B57" }}>Play</Text>
</Text>        
</View>

        <TouchableOpacity onPress={handleSkip} activeOpacity={0.8}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 28, 10],
              extrapolate: "clamp",
            });

            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                  },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNext}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.bottomHint}>
          Reserve faster. Play smarter. Enjoy more.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = width * 0.82;
const CARD_HEIGHT = height * 0.36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 4,
  },

  logoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  logoBall: {
    fontSize: 16,
    marginRight: 8,
  },

  logoText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },

  skip: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },

  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  heroContainer: {
    marginTop: 10,
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  heroGlow: {
    position: "absolute",
    width: CARD_WIDTH + 30,
    height: CARD_HEIGHT + 30,
    backgroundColor: "#DFF3E7",
    borderRadius: 40,
    opacity: 0.9,
  },

  heroCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  badge: {
    position: "absolute",
    top: 18,
    left: 18,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  iconWrapper: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  emoji: {
    fontSize: 56,
  },

  miniCardRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  miniCard: {
    backgroundColor: "#F8F8F8",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    minWidth: 110,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  miniCardLabel: {
    fontSize: 12,
    color: COLORS.subText,
    marginBottom: 4,
  },

  miniCardValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.text,
    marginBottom: 14,
    lineHeight: 38,
  },

  description: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.subText,
    lineHeight: 25,
    maxWidth: 310,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  dot: {
    height: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    marginHorizontal: 5,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },

  bottomHint: {
    textAlign: "center",
    color: COLORS.subText,
    marginTop: 14,
    fontSize: 13,
  },

  bgCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },

  bgCircleOne: {
    width: 170,
    height: 170,
    top: 90,
    right: -40,
  },

  bgCircleTwo: {
    width: 120,
    height: 120,
    bottom: 180,
    left: -30,
  },

  bgCircleThree: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "#D9EEE0",
    top: 180,
    left: 30,
    opacity: 0.8,
  },
});