export type Template = {
  id: string;
  name: string;
  bg: string;
  ink: string;
  accent: string;
  font: string;
  motif: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "aura",
    name: "Aura",
    bg: "#F5F0FF",
    ink: "#3B2D6E",
    accent: "#9B72CF",
    font: "serif-display",
    motif: "✦",
  },
  {
    id: "bloom",
    name: "Bloom",
    bg: "#FFF0F5",
    ink: "#6B2D4E",
    accent: "#E8728A",
    font: "script-elegant",
    motif: "❀",
  },
  {
    id: "celestial",
    name: "Celestial",
    bg: "#0F1B35",
    ink: "#E8E4F0",
    accent: "#C4A8E8",
    font: "serif-display",
    motif: "★",
  },
  {
    id: "dusk",
    name: "Dusk",
    bg: "#FDF3EC",
    ink: "#5C3317",
    accent: "#D4845A",
    font: "sans-modern",
    motif: "◆",
  },
  {
    id: "ember",
    name: "Ember",
    bg: "#1A1208",
    ink: "#F5E6D0",
    accent: "#C97B2E",
    font: "serif-display",
    motif: "♦",
  },
  {
    id: "flora",
    name: "Flora",
    bg: "#F0F7F0",
    ink: "#1E3A1E",
    accent: "#5C9E5C",
    font: "script-elegant",
    motif: "✿",
  },
  {
    id: "golden",
    name: "Golden",
    bg: "#FDFAF0",
    ink: "#3D3010",
    accent: "#C8A84B",
    font: "serif-display",
    motif: "◇",
  },
  {
    id: "haven",
    name: "Haven",
    bg: "#EEF4FB",
    ink: "#1A3456",
    accent: "#5B8DB8",
    font: "sans-modern",
    motif: "◈",
  },
  {
    id: "iris",
    name: "Iris",
    bg: "#F8F0FF",
    ink: "#2D1054",
    accent: "#7C4DBC",
    font: "script-elegant",
    motif: "✧",
  },
  {
    id: "jasmine",
    name: "Jasmine",
    bg: "#FFFBF5",
    ink: "#4A2D14",
    accent: "#E8A87C",
    font: "serif-display",
    motif: "✺",
  },
  {
    id: "knot",
    name: "Knot",
    bg: "#FFFFFF",
    ink: "#111111",
    accent: "#555555",
    font: "sans-modern",
    motif: "◉",
  },
  {
    id: "lumiere",
    name: "Lumière",
    bg: "#FDFAF5",
    ink: "#2A2010",
    accent: "#D4AF6A",
    font: "serif-display",
    motif: "✶",
  },
];

export const DEFAULT_TEMPLATE_ID = "aura";
