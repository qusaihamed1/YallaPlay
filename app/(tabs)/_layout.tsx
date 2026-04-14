import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#16A34A",
          tabBarInactiveTintColor: "#999",

          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#eee",
            height: 70,
            paddingBottom: 10,
            paddingTop: 5,
          },

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        {/* ❌ اخفاء index */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="my-booking" options={{ href: null }} />
        {/* ❌ اخفاء payment */}
        <Tabs.Screen name="payment" options={{ href: null }} />
        <Tabs.Screen name="edit-booking" options={{ href: null }} />
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="booking"
          options={{
            title: "Bookings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* ✅ الخط الأخضر تحت النافبار */}
      <View
        style={{
          height: 30,
          backgroundColor: "#21A366",
          width: "100%",
        }}
      />
    </>
  );
}