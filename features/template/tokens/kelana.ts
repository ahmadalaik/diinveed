import type { TemplateTokens } from "./types";

/**
 * Token desain template Kelana — bagian yang diekspos ke editor, mengikuti
 * model "Ubah Desain" Katsudoto (3 warna + 2 grup font).
 *
 * Pemetaan dari palet asli Kelana ke 3 tier warna (urut dominasi visual saat
 * diam, bukan jumlah class — sebagian besar sage adalah state hover/focus):
 * - primary   = #2c2c2c (charcoal)   — paling dominan: teks utama + tombol CTA.
 * - secondary = #d4cbb3 (gold/tan)   — aksen kedua di latar gelap/banner.
 * - tertiary  = #6b7c62 (sage/olive) — aksen paling jarang (kebanyakan highlight hover/focus).
 *
 * Catatan: palet netral Kelana (paper krem berlapis, surface gelap stone-900,
 * teks terang/redup) dan dekorasi (tekstur cream-paper, motion galeri) TIDAK
 * diekspos di sini karena Katsudoto pun tidak mengeksposnya — itu tetap nilai
 * tetap (fixed) milik template saat wiring nanti.
 */
export const kelanaTokens: TemplateTokens = {
  template: "kelana",
  name: "Kelana",
  colors: {
    primary: "#2c2c2c", // charcoal — teks utama & tombol CTA
    secondary: "#d4cbb3", // gold/tan
    tertiary: "#6b7c62", // sage/olive — aksen jarang
  },
  typography: {
    display: {
      family: "var(--font-script)", // Great Vibes — nama mempelai
      size: "3rem",
      weight: 400, // single-weight font
      transform: "none",
    },
    heading: {
      family: "var(--font-serif)", // Cormorant Garamond
      size: "1.5rem",
      weight: 500,
      transform: "uppercase", // label/eyebrow heading Kelana
    },
    body: {
      family: "var(--font-montserrat)", // Montserrat
      size: "1rem",
      weight: 400,
      transform: "none",
    },
  },
};
