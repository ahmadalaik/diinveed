import { findGoogleFont } from "@/features/invitation/components/editor/content/sections/typography/data/font-list";

export function buildGoogleFontsUrl(value: string) {
  const font = findGoogleFont(value);
  if (!font) return undefined;

  const weights = font.weights.join(";");
  const params = new URLSearchParams({
    family: `${font.family}:wght@${weights}`,
    display: "swap",
  });

  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}

export function loadGoogleFont(value: string) {
  if (typeof document === "undefined") return undefined;

  const font = findGoogleFont(value);
  const href = buildGoogleFontsUrl(value);
  if (!font || !href) return undefined;

  const selector = `link[data-google-font="${CSS.escape(font.family)}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);
  if (existing) return existing;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.googleFont = font.family;
  document.head.appendChild(link);

  return link;
}
