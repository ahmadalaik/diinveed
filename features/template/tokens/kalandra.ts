import type { TemplateTokens } from "./types";

export const kalandraTokens: TemplateTokens = {
  template: "kalandra",
  name: "Kalandra",
  colors: {
    background: {
      // primary: "#fcfbf9", // krem/paper berlapis
      // secondary: "#f4f1ea", // stone-900 surface
      // tertiary: "#d4cbb3", // gold/tan aksen
      primary: "#F5EEE6",
      secondary: "#E7D8C9",
      tertiary: "#C6B5A7",
    },
    text: {
      // primary: "#2c2c2c", // Charcoal: Teks utama, judul, paragraf (paling mudah dibaca)
      // secondary: "#fafaf9", // White (stone-50)
      // tertiary: "#d4cbb3", // Gold: Highlight kata tertentu, ikon, atau inisial
      // // inverse: "#ffffff", // Putih: KHUSUS untuk teks di atas background image
      primary: "#FFFFFF",
      secondary: "#6F756D",
      tertiary: "#2D2D2D",
    },
    button: {
      primary: {
        text: "#FFFFFF",
        background: "#6F756D",
      },
      secondary: {
        text: "#fafaf9",
        background: "#6b7c62",
      },
      // tertiary: "#fafaf9", // Gold: Tombol sekunder (misal: "Simpan Tanggal")
    },
  },
  typography: {
    // display: {
    //   family: "var(--font-script)", // Great Vibes — nama mempelai
    //   size: "3rem",
    //   weight: 400, // single-weight font
    //   transform: "none",
    // },
    heading: {
      family: "var(--font-script)", // Cormorant Garamond
      size: "1.5rem",
      weight: 400,
      transform: "capitalize", // label/eyebrow heading Kalandra
    },
    body: {
      family: "var(--font-montserrat)", // Montserrat
      size: "1rem",
      weight: 400,
      transform: "none",
    },
  },
};
