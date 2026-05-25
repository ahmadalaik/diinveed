export type Palette = {
  idx: number;
  name: string;
  bg: string;
  ink: string;
  accent: string;
};

export const PALETTES: Palette[] = [
  { idx: 0, name: "Warm", bg: "#FDF3EC", ink: "#3D1A0A", accent: "#C97B2E" },
  { idx: 1, name: "Cool", bg: "#EEF4FB", ink: "#0F2645", accent: "#3A78B5" },
  { idx: 2, name: "Mono", bg: "#F5F5F5", ink: "#111111", accent: "#666666" },
  {
    idx: 3,
    name: "Romantic",
    bg: "#FFF0F3",
    ink: "#5C0A22",
    accent: "#D4607A",
  },
  {
    idx: 4,
    name: "Botanical",
    bg: "#EEF6EE",
    ink: "#0F2E0F",
    accent: "#3E8E3E",
  },
];
