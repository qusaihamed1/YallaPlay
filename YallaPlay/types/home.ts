import { ImageSourcePropType } from "react-native";

export type SportType = "football" | "basketball" | "tennis" | "handball";

export type UserData = {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  favoriteSport?: SportType;
  bio?: string;
  photoUri?: string;
};

export type FieldItem = {
  id: string;
  name: string;
  sport?: SportType;
  location?: string;
  distance: string;
  price: string | number;
  duration?: string;
  rating: string | number;
  reviews?: string | number;
  availableNow: boolean;
  image?: ImageSourcePropType;
  imageKey?: string;
  description?: string;
  address?: string;
  amenities?: string[];
  openingHours?: string;
  rules?: string[];
  availableSlots?: string[];
  surface?: string;
  capacity?: string;
  recommendedFor?: string[];
  cancellationPolicy?: string;
};
