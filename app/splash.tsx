import { router } from "expo-router";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundDecor from "../components/splash/BackgroundDecor";
import SplashAnimation from "../components/splash/SplashAnimation";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecor />
      <SplashAnimation onFinish={() => router.replace("/onboarding")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
  },
});