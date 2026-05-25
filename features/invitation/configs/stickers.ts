export type Sticker = {
  id: string;
  label: string;
  glyph: string;
};

export const STICKERS: Sticker[] = [
  { id: "ring", label: "Ring", glyph: "💍" },
  { id: "heart", label: "Heart", glyph: "❤️" },
  { id: "dove", label: "Dove", glyph: "🕊️" },
  { id: "flower", label: "Flower", glyph: "🌸" },
  { id: "leaf", label: "Leaf", glyph: "🍃" },
  { id: "star", label: "Star", glyph: "⭐" },
  { id: "sparkle", label: "Sparkle", glyph: "✨" },
  { id: "bouquet", label: "Bouquet", glyph: "💐" },
  { id: "candle", label: "Candle", glyph: "🕯️" },
  { id: "ribbon", label: "Ribbon", glyph: "🎀" },
];
