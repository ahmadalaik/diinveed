import { TemplateTokens } from "./types";

export const agnimayaTokens: TemplateTokens = {
  template: "agnimaya",
  name: "Agnimaya",
  colors: {
    background: {
      primary: "#faf6f0", // ivory
      secondary: "#decdb5", // champagne
      tertiary: "#b8844d", // gold
    },
    text: {
      primary: "#4a3b33", // espresso
      secondary: "#78491f", // camel
      tertiary: "#faf6f0", // rosegold
    },
    button: {
      primary: {
        background: "#b76e79", // rosegold
        text: "#fbf8f1"
      },
      secondary: {
        background: "#4a3b33", // espresso
        text: "#fbf8f1"
      }
    },
  },
  typography: {
    heading: {
      family: "var(--font-serif)", // Menggunakan font-serif seperti di class utama
      size: "1.5rem",
      weight: 500,
      transform: "uppercase",
    },
    body: {
      family: "var(--font-sans)", // Di classic theme wrapper menggunakan font-serif
      size: "1rem",
      weight: 400,
      transform: "none",
    },
  },
};
