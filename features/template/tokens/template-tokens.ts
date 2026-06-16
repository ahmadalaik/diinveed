import type { TemplateTokens, TemplateTokenOverrides } from "./types";
import { kelanaTokens } from "./kelana";

/** Registry token base per slug template. */
export const TEMPLATE_TOKENS: Record<string, TemplateTokens> = {
  kelana: kelanaTokens,
};

export const DEFAULT_TEMPLATE_TOKENS = kelanaTokens;

/** Ambil token base sebuah template; fallback ke default bila slug tak dikenal. */
export function getTemplateTokens(slug: string): TemplateTokens {
  return TEMPLATE_TOKENS[slug] ?? DEFAULT_TEMPLATE_TOKENS;
}

/** Gabungkan token base dengan override per-undangan (override menang). */
export function mergeTemplateTokenOverrides(
  base: TemplateTokens,
  overrides?: TemplateTokenOverrides | null,
): TemplateTokens {
  if (!overrides) return base;
  return {
    ...base,
    colors: { ...base.colors, ...overrides.colors },
    typography: {
      display: { ...base.typography.display, ...overrides.typography?.display },
      heading: { ...base.typography.heading, ...overrides.typography?.heading },
      body: { ...base.typography.body, ...overrides.typography?.body },
    },
  };
}
