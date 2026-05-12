import API from "./api";
import { SportType } from "../types/home";

export type FieldItem = {
  id: string;
  name: string;
  sport: SportType;
  location: string;
  distance: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  availableNow: boolean;
  imageKey: string;
  description: string;
  address: string;
  amenities: string[];
  openingHours: string;
  rules: string[];
  availableSlots?: string[];
  surface?: string;
  capacity?: string;
  recommendedFor?: string[];
  cancellationPolicy?: string;
};

export async function getFields() {
  const response = await API.get<FieldItem[]>("/fields");
  return response.data;
}

export async function getFieldById(id: string) {
  const response = await API.get<FieldItem>(`/fields/${id}`);
  return response.data;
}

export async function searchFields(query: string) {
  const response = await API.get<FieldItem[]>("/fields/search", {
    params: { q: query },
  });
  return response.data;
}
