import { InvitationToken, TokenOverrides } from "./types";

export const TOKENS: InvitationToken[] = [
  {
    theme: "aura",
    name: "Aura",
    colors: { primary: "#3B2D6E", accent: "#9B72CF", background: "#F5F0FF" },
    typography: { heading: "Georgia", body: "Inter" },
    borderRadius: "rounded",
  },
  {
    theme: "bloom",
    name: "Bloom",
    colors: { primary: "#6B2D4E", accent: "#E8728A", background: "#FFF0F5" },
    typography: { heading: "Dancing Script", body: "Inter" },
    borderRadius: "rounded",
  },
  {
    theme: "celestial",
    name: "Celestial",
    colors: { primary: "#E8E4F0", accent: "#C4A8E8", background: "#0F1B35" },
    typography: { heading: "Georgia", body: "Inter" },
    borderRadius: "minimal",
  },
  {
    theme: "dusk",
    name: "Dusk",
    colors: { primary: "#5C3317", accent: "#D4845A", background: "#FDF3EC" },
    typography: { heading: "Inter", body: "Inter" },
    borderRadius: "minimal",
  },
  {
    theme: "ember",
    name: "Ember",
    colors: { primary: "#F5E6D0", accent: "#C97B2E", background: "#1A1208" },
    typography: { heading: "Georgia", body: "Inter" },
    borderRadius: "minimal",
  },
  {
    theme: "flora",
    name: "Flora",
    colors: { primary: "#1E3A1E", accent: "#5C9E5C", background: "#F0F7F0" },
    typography: { heading: "Dancing Script", body: "Inter" },
    borderRadius: "rounded",
  },
  {
    theme: "golden",
    name: "Golden",
    colors: { primary: "#3D3010", accent: "#C8A84B", background: "#FDFAF0" },
    typography: { heading: "Georgia", body: "Inter" },
    borderRadius: "minimal",
  },
  {
    theme: "haven",
    name: "Haven",
    colors: { primary: "#1A3456", accent: "#5B8DB8", background: "#EEF4FB" },
    typography: { heading: "Inter", body: "Inter" },
    borderRadius: "rounded",
  },
  {
    theme: "iris",
    name: "Iris",
    colors: { primary: "#2D1054", accent: "#7C4DBC", background: "#F8F0FF" },
    typography: { heading: "Dancing Script", body: "Inter" },
    borderRadius: "rounded",
  },
  {
    theme: "jasmine",
    name: "Jasmine",
    colors: { primary: "#4A2D14", accent: "#E8A87C", background: "#FFFBF5" },
    typography: { heading: "Georgia", body: "Inter" },
    borderRadius: "minimal",
  },
  {
    theme: "knot",
    name: "Knot",
    colors: { primary: "#111111", accent: "#555555", background: "#FFFFFF" },
    typography: { heading: "Inter", body: "Inter" },
    borderRadius: "minimal",
  },
  {
    theme: "lumiere",
    name: "Lumière",
    colors: { primary: "#2A2010", accent: "#D4AF6A", background: "#FDFAF5" },
    typography: { heading: "Georgia", body: "Inter" },
    borderRadius: "minimal",
  },
];

export const DEFAULT_TOKEN_ID = "aura";

export function getToken(id: string) {
  return TOKENS.find((t) => t.theme === id);
}

export function mergeTokenOverrides(
  token: InvitationToken,
  overrides?: TokenOverrides | null,
): InvitationToken {
  if (!overrides) return token;
  return {
    ...token,
    colors: { ...token.colors, ...overrides.colors },
    typography: { ...token.typography, ...overrides.typography },
    borderRadius: overrides.borderRadius ?? token.borderRadius,
  };
}
