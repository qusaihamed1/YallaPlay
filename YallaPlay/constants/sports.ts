import { SportType } from "../types/home";

export const SPORTS: { label: string; value: SportType; emoji: string }[] = [
  { label: "Football", value: "football", emoji: "⚽" },
  { label: "Basketball", value: "basketball", emoji: "🏀" },
  { label: "Tennis", value: "tennis", emoji: "🎾" },
  { label: "Handball", value: "handball", emoji: "🤾" },
];

export function getSportLabel(value?: SportType) {
  return SPORTS.find((sport) => sport.value === value)?.label || "Sport";
}

export function getSportEmoji(value?: SportType) {
  return SPORTS.find((sport) => sport.value === value)?.emoji || "🏟️";
}
