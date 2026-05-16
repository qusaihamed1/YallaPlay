import { Redirect } from "expo-router";

import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  View,
} from "react-native";

import { COLORS } from "../constants/colors";

import { getSecureAuthSession } from "../utils/secureAuth";

export default function Index() {
  const [checked, setChecked] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSecureAuthSession();

        console.log("SESSION:", session);

        if (session?.token && session?.userId) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.log(error);

        setLoggedIn(false);
      } finally {
        setChecked(true);
      }
    };

    checkSession();
  }, []);

  if (!checked) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  return (
    <Redirect
      href={loggedIn ? "/(tabs)/home" : "/login"}
    />
  );
}