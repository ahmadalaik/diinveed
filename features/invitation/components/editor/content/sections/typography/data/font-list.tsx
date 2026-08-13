export const FONT_CATEGORIES = [
  "Semua",
  "Sans Serif",
  "Serif",
  "Handwriting",
  "Monospace",
] as const;

export type FontCategory = Exclude<(typeof FONT_CATEGORIES)[number], "Semua">;

export type GoogleFontDefinition = {
  family: string;
  label: string;
  category: FontCategory;
  fallback: string;
  weights: readonly number[];
  value: string;
  legacyValues?: readonly string[];
};

const WEIGHTS = [400, 500, 600, 700] as const;
const SCRIPT_WEIGHTS = [400] as const;

function font(
  family: string,
  category: FontCategory,
  fallback: string,
  options: {
    label?: string;
    weights?: readonly number[];
    legacyValues?: readonly string[];
  } = {},
): GoogleFontDefinition {
  return {
    family,
    label: options.label ?? family,
    category,
    fallback,
    weights: options.weights ?? WEIGHTS,
    value: `"${family}", ${fallback}`,
    legacyValues: options.legacyValues,
  };
}

export const FONT_LIST: readonly GoogleFontDefinition[] = [
  font("Inter", "Sans Serif", "Arial, sans-serif", {
    legacyValues: ["var(--font-sans)"],
  }),
  font("Geist", "Sans Serif", "Arial, sans-serif", {
    legacyValues: ["var(--font-geist-sans)"],
  }),
  font("Montserrat", "Sans Serif", "Arial, sans-serif", {
    legacyValues: ["var(--font-montserrat)"],
  }),
  font("Outfit", "Sans Serif", "Arial, sans-serif", {
    legacyValues: ["var(--font-outfit)"],
  }),
  font("Plus Jakarta Sans", "Sans Serif", "Arial, sans-serif", {
    label: "Plus Jakarta",
    legacyValues: ["var(--font-jakarta)"],
  }),
  font("Josefin Sans", "Sans Serif", "Arial, sans-serif", {
    legacyValues: ["var(--font-josefin)"],
  }),
  font("DM Sans", "Sans Serif", "Arial, sans-serif"),
  font("Manrope", "Sans Serif", "Arial, sans-serif"),
  font("Nunito Sans", "Sans Serif", "Arial, sans-serif"),
  font("Raleway", "Sans Serif", "Arial, sans-serif"),
  font("Roboto", "Sans Serif", "Arial, sans-serif"),
  font("Lato", "Sans Serif", "Arial, sans-serif"),
  font("Poppins", "Sans Serif", "Arial, sans-serif"),
  font("Source Sans 3", "Sans Serif", "Arial, sans-serif"),

  font("Cormorant Garamond", "Serif", "Georgia, serif", {
    label: "Cormorant",
    legacyValues: ["var(--font-serif)"],
  }),
  font("Lora", "Serif", "Georgia, serif", {
    legacyValues: ["var(--font-lora)"],
  }),
  font("Fraunces", "Serif", "Georgia, serif", {
    legacyValues: ["var(--font-fraunces)"],
  }),
  font("Playfair Display", "Serif", "Georgia, serif", {
    legacyValues: ["var(--font-playfair)"],
  }),
  font("Cinzel", "Serif", "Georgia, serif", {
    legacyValues: ["var(--font-cinzel)"],
  }),
  font("Prata", "Serif", "Georgia, serif", {
    weights: SCRIPT_WEIGHTS,
    legacyValues: ["var(--font-prata)"],
  }),
  font("Bodoni Moda", "Serif", "Georgia, serif"),
  font("Cardo", "Serif", "Georgia, serif", { weights: [400, 700] }),
  font("Crimson Pro", "Serif", "Georgia, serif"),
  font("DM Serif Display", "Serif", "Georgia, serif", {
    weights: SCRIPT_WEIGHTS,
  }),
  font("Libre Baskerville", "Serif", "Georgia, serif", {
    weights: [400, 700],
  }),
  font("Merriweather", "Serif", "Georgia, serif"),
  font("Noto Serif", "Serif", "Georgia, serif"),
  font("Spectral", "Serif", "Georgia, serif"),

  font("Great Vibes", "Handwriting", "cursive", {
    weights: SCRIPT_WEIGHTS,
    legacyValues: ["var(--font-script)"],
  }),
  font("Dancing Script", "Handwriting", "cursive", {
    legacyValues: ["var(--font-dancing)"],
  }),
  font("Caveat", "Handwriting", "cursive", {
    legacyValues: ["var(--font-caveat)"],
  }),
  font("Alex Brush", "Handwriting", "cursive", {
    weights: SCRIPT_WEIGHTS,
    legacyValues: ["var(--font-alex)"],
  }),
  font("Sacramento", "Handwriting", "cursive", {
    weights: SCRIPT_WEIGHTS,
    legacyValues: ["var(--font-sacramento)"],
  }),
  font("Parisienne", "Handwriting", "cursive", {
    weights: SCRIPT_WEIGHTS,
    legacyValues: ["var(--font-parisienne)"],
  }),
  font("Pinyon Script", "Handwriting", "cursive", {
    weights: SCRIPT_WEIGHTS,
    legacyValues: ["var(--font-pinyon)"],
  }),
  font("Allura", "Handwriting", "cursive", { weights: SCRIPT_WEIGHTS }),
  font("Birthstone", "Handwriting", "cursive", { weights: SCRIPT_WEIGHTS }),
  font("Italianno", "Handwriting", "cursive", { weights: SCRIPT_WEIGHTS }),
  font("Kaushan Script", "Handwriting", "cursive", {
    weights: SCRIPT_WEIGHTS,
  }),
  font("Marck Script", "Handwriting", "cursive", {
    weights: SCRIPT_WEIGHTS,
  }),
  font("Satisfy", "Handwriting", "cursive", { weights: SCRIPT_WEIGHTS }),

  font("Geist Mono", "Monospace", "monospace", {
    legacyValues: ["var(--font-geist-mono)"],
  }),
  font("Fira Code", "Monospace", "monospace", {
    legacyValues: ["var(--font-fira)"],
  }),
  font("IBM Plex Mono", "Monospace", "monospace"),
  font("JetBrains Mono", "Monospace", "monospace"),
  font("Roboto Mono", "Monospace", "monospace"),
  font("Space Mono", "Monospace", "monospace"),
  font("Source Code Pro", "Monospace", "monospace"),
];

export function findGoogleFont(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return undefined;

  return FONT_LIST.find(
    (entry) =>
      entry.family.toLowerCase() === normalized ||
      entry.value.toLowerCase() === normalized ||
      entry.legacyValues?.some(
        (legacyValue) => legacyValue.toLowerCase() === normalized,
      ),
  );
}
