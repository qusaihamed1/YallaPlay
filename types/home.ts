import { ImageSourcePropType } from "react-native";

export type SportType = "football" | "basketball";

export type UserData = {
  fullName?: string;
  email?: string;
};

export type FieldItem = {
  id: string;
  name: string;
  distance: string;
  price: string;
  rating: string;
  availableNow: boolean;
  image?: ImageSourcePropType;
};