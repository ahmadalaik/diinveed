import type { CSSProperties } from "react";
import type { TemplateTokens } from "./types";

/**
 * Ubah `TemplateTokens` menjadi CSS custom properties (prefix `--tpl-`) untuk
 * disetel di elemen wrapper sebuah template.
 *
 * Komponen membaca nilai ini lewat utility seperti `text-[var(--tpl-primary)]`,
 * sehingga seluruh modifier Tailwind (responsif `lg:`, opacity `/20`, gradient,
 * `ring-`) tetap berfungsi sementara nilainya bisa diganti dari editor cukup
 * dengan menyetel ulang variable di wrapper.
 *
 * Catatan: `size`/`weight`/`transform` sudah diemit tapi belum dikonsumsi
 * komponen — disediakan untuk wiring typography berikutnya.
 */
export function templateCssVars(tokens: TemplateTokens): CSSProperties {
  const { colors, typography } = tokens;
  
  return {
    "--tpl-bg-primary": colors.background.primary,
    "--tpl-bg-secondary": colors.background.secondary,
    "--tpl-bg-tertiary": colors.background.tertiary,

    "--tpl-text-primary": colors.text.primary,
    "--tpl-text-secondary": colors.text.secondary,
    "--tpl-text-tertiary": colors.text.tertiary,

    "--tpl-btn-bg-primary": colors.button.primary.background,
    "--tpl-btn-text-primary": colors.button.primary.text,
    "--tpl-btn-bg-secondary": colors.button.secondary.background,
    "--tpl-btn-text-secondary": colors.button.secondary.text,
    // "--tpl-button-tertiary": colors.button.tertiary,

    // "--tpl-font-display": typography.display.family,
    "--tpl-font-heading": typography.heading.family,
    "--tpl-font-body": typography.body.family,

    // "--tpl-size-display": typography.display.size,
    "--tpl-size-heading": typography.heading.size,
    "--tpl-size-body": typography.body.size,

    // "--tpl-weight-display": String(typography.display.weight),
    "--tpl-weight-heading": String(typography.heading.weight),
    "--tpl-weight-body": String(typography.body.weight),

    // "--tpl-transform-display": typography.display.transform,
    "--tpl-transform-heading": typography.heading.transform,
    "--tpl-transform-body": typography.body.transform,
  } as CSSProperties;
}
