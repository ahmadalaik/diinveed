import type { TemplateTokens, TemplateTokenOverrides } from "./types";
import { kalandraTokens } from "./kalandra";
import { dikaraTokens } from "./dikara";
import { pradiptaTokens } from "./pradipta";

/** Registry token base per slug template. */
export const TEMPLATE_TOKENS: Record<string, TemplateTokens> = {
  kalandra: kalandraTokens,
  dikara: dikaraTokens,
  pradipta: pradiptaTokens,
};

export const DEFAULT_TEMPLATE_TOKENS = kalandraTokens;

export function getTemplateTokens(slug: string): TemplateTokens {
  return TEMPLATE_TOKENS[slug] ?? DEFAULT_TEMPLATE_TOKENS;
}

export function mergeTemplateTokenOverrides(
  base: TemplateTokens,
  overrides?: TemplateTokenOverrides | null,
): TemplateTokens {
  if (!overrides) return base;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: {
        ...base.colors.background,
        ...overrides.colors?.background,
      },
      text: { ...base.colors.text, ...overrides.colors?.text },
      button: {
        ...base.colors.button,
        primary: {
          ...base.colors.button.primary,
          ...overrides.colors?.button?.primary,
        },
        secondary: {
          ...base.colors.button.secondary,
          ...overrides.colors?.button?.secondary,
        },
      },
    },
    typography: {
      // display: { ...base.typography.display, ...overrides.typography?.display },
      heading: { ...base.typography.heading, ...overrides.typography?.heading },
      body: { ...base.typography.body, ...overrides.typography?.body },
    },
  };
}
