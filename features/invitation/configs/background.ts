export type BackgroundType = {
  id: string;
  label: string;
};

export const BACKGROUND_TYPES: BackgroundType[] = [
  { id: "solid", label: "Solid" },
  { id: "gradient", label: "Gradient" },
  { id: "pattern", label: "Pattern" },
  { id: "image", label: "Image" },
];
