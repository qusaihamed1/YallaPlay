import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../Config/firebaseConfig";
import BackgroundDecor from "../components/splash/BackgroundDecor";
import SplashAnimation from "../components/splash/SplashAnimation";

const INTRO_KEY = "yallaplay_intro_seen_v2";

export default function SplashScreen() {
  const handleFinish = async () => {
    const introSeen = await AsyncStorage.getItem(INTRO_KEY);
    const user = auth.currentUser;

    if (user) {
      router.replace("/home");
      return;
    }

    router.replace(introSeen ? "/login" : "/onboarding");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecor />
      <SplashAnimation onFinish={handleFinish} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
  },
});
