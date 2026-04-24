import { router } from "expo-router";
<<<<<<< HEAD
import { useRef, useState } from "react";
=======
import React, { useRef, useState } from "react";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundDecor from "../components/onboarding/backgroundDecor";
import OnboardingFooter from "../components/onboarding/onboardingFooter";
import OnboardingHeader from "../components/onboarding/onboardingHeader";
import OnboardingSlide from "../components/onboarding/onboardingSlide";
<<<<<<< HEAD
import { SlideItem, slides } from "../data/onboardingSlides";
=======
import { slides, SlideItem } from "../data/onboardingSlides";
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#F7F9F8",
};

export default function OnboardingScreen() {
<<<<<<< HEAD
  const flatListRef = useRef<FlatList<SlideItem> | null>(null);
=======
  const flatListRef = useRef<FlatList<SlideItem>>(null);
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
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
<<<<<<< HEAD
      const nextIndex = currentIndex + 1;

      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });

      setCurrentIndex(nextIndex);
=======
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
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
      <OnboardingHeader onSkip={handleSkip} />

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
<<<<<<< HEAD
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
=======
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => (
          <OnboardingSlide item={item} index={index} scrollX={scrollX} />
        )}
      />

      <OnboardingFooter
        count={slides.length}
        currentIndex={currentIndex}
        scrollX={scrollX}
        onNext={handleNext}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});