import type { TemplateTokens } from "./types";

/**
 * Token desain template Dikara.
 * Menggunakan gambar sebagai background utama, tanpa warna solid pada section.
 */
export const dikaraTokens: TemplateTokens = {
  template: "dikara",
  name: "Dikara",
  colors: {
    background: {
      primary: "#fcfbf9",
      secondary: "#f4f1ea",
      tertiary: "#d4cbb3",
    },
    text: {
      primary: "#fafaf9",
      secondary: "#2c2c2c",
      tertiary: "#d4cbb3",
    },
    button: {
      primary: {
        text: "#fafaf9",
        background: "#2c2c2c",
      },
      secondary: {
        text: "#fafaf9",
        background: "#6b7c62"
      }
    },
  },
  typography: {
    heading: {
      family: "var(--font-script)",
      size: "1.5rem",
      weight: 400,
      transform: "capitalize",
    },
    body: {
      family: "var(--font-montserrat)",
      size: "1rem",
      weight: 400,
      transform: "none",
    },
  },
};
