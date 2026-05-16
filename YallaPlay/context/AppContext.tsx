import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SportType } from "../types/home";

type AppContextValue = {
  favoriteSport: SportType;
  favorites: string[];
  changeFavoriteSport: (sport: SportType) => Promise<void>;
  toggleFavoriteField: (fieldId: string) => Promise<void>;
  isFavoriteField: (fieldId: string) => boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);
const FAVORITE_SPORT_KEY = "favoriteSport";
const FAVORITE_FIELDS_KEY = "favoriteFields";
const allowedSports: SportType[] = ["football", "basketball", "tennis", "handball"];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favoriteSport, setFavoriteSport] = useState<SportType>("football");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadPreferences = async () => {
      const savedSport = await AsyncStorage.getItem(FAVORITE_SPORT_KEY);
      const savedFavorites = await AsyncStorage.getItem(FAVORITE_FIELDS_KEY);

      if (allowedSports.includes(savedSport as SportType)) {
        setFavoriteSport(savedSport as SportType);
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    };

    loadPreferences();
  }, []);

  const changeFavoriteSport = useCallback(async (sport: SportType) => {
    setFavoriteSport(sport);
    await AsyncStorage.setItem(FAVORITE_SPORT_KEY, sport);
  }, []);

  const toggleFavoriteField = useCallback(async (fieldId: string) => {
    setFavorites((current) => {
      const next = current.includes(fieldId)
        ? current.filter((id) => id !== fieldId)
        : [...current, fieldId];

      AsyncStorage.setItem(FAVORITE_FIELDS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavoriteField = useCallback((fieldId: string) => favorites.includes(fieldId), [favorites]);

  const value = useMemo(
    () => ({ favoriteSport, favorites, changeFavoriteSport, toggleFavoriteField, isFavoriteField }),
    [favoriteSport, favorites, changeFavoriteSport, toggleFavoriteField, isFavoriteField]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
