<<<<<<< HEAD
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FieldCard from "../../components/home/fieldCard";
import { COLORS } from "../../constants/colors";
import { basketballFields, footballFields } from "../../data/fields";
import useUser from "../../hooks/useUser";

export default function Explore() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState<"football" | "basketball">("football");

  const userData = useUser();
  const name = userData?.fullName || "User";
  const avatarLetter = name.charAt(0).toUpperCase();

  const allFields =
    selectedSport === "football" ? footballFields : basketballFields;

  const filtered = allFields.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Search</Text>
          <Text style={styles.name}>Find your field</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TextInput
          placeholder="Search fields..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        <View style={styles.filters}>
          <TouchableOpacity
            style={[
              styles.filter,
              selectedSport === "football" && styles.active,
            ]}
            onPress={() => setSelectedSport("football")}
          >
            <Text
              style={[
                styles.filterText,
                selectedSport === "football" && styles.activeText,
              ]}
            >
              Football
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filter,
              selectedSport === "basketball" && styles.active,
            ]}
            onPress={() => setSelectedSport("basketball")}
          >
            <Text
              style={[
                styles.filterText,
                selectedSport === "basketball" && styles.activeText,
              ]}
            >
              Basketball
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FieldCard
              name={item.name}
              distance={item.distance}
              price={item.price}
              rating={item.rating}
              availableNow={item.availableNow}
              selectedSport={selectedSport}
              image={item.image}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No fields found.</Text>
          }
        />
      </View>
    </View>
=======
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore
        </ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "#D8F7E7",
    fontSize: 14,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  search: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  filters: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },
  filter: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    borderRadius: 20,
  },
  filterText: {
    color: "#222",
    fontWeight: "600",
  },
  active: {
    backgroundColor: COLORS.primary,
  },
  activeText: {
    color: "#fff",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
    fontSize: 16,
  },
});
=======
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
>>>>>>> 6a3814b831544d8d7e0d1f4beef064147cb76ed9
