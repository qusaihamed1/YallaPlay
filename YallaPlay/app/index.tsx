import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/colors";

const SKIP_SPLASH_KEY = "yallaplay_skip_splash_once";

export default function AppEntry() {
  const [ready, setReady] = useState(false);
  const [target, setTarget] = useState<"/splash" | "/login">("/splash");

  useEffect(() => {
    const prepareRoute = async () => {
      const skipSplash = await AsyncStorage.getItem(SKIP_SPLASH_KEY);

      if (skipSplash) {
        await AsyncStorage.removeItem(SKIP_SPLASH_KEY);
        setTarget("/login");
      } else {
        setTarget("/splash");
      }

      setReady(true);
    };

    prepareRoute();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <Redirect href={target} />;
}
