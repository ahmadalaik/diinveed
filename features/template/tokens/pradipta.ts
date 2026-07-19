import type { TemplateTokens } from "./types";

export const pradiptaTokens: TemplateTokens = {
  template: "pradipta",
  name: "Pradipta",
  colors: {
    background: {
      primary: "#fcfbf9", // krem/paper berlapis
      secondary: "#f4f1ea", // stone-900 surface
      tertiary: "#d4cbb3", // gold/tan aksen
    },
    text: {
      primary: "#2c2c2c", // Charcoal: Teks utama, judul, paragraf (paling mudah dibaca)
      secondary: "#fafaf9", // White (stone-50)
      tertiary: "#d4cbb3", // Gold: Highlight kata tertentu, ikon, atau inisial
      // inverse: "#ffffff", // Putih: KHUSUS untuk teks di atas background image
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
      family: "var(--font-caveat)", // Cormorant Garamond
      size: "1.5rem",
      weight: 400,
      transform: "capitalize", // label/eyebrow heading Pradipta
    },
    body: {
      family: "var(--font-montserrat)", // Montserrat
      size: "1rem",
      weight: 400,
      transform: "none",
    },
  },
};
