import { BorderRadius, InvitationToken } from "./types";

export const BORDER_RADIUS_MAP: Record<BorderRadius, string> = {
  minimal: "4px",
  rounded: "12px",
  pill: "9999px",
};

export function applyTokens(token: InvitationToken, el: HTMLElement): void {
  el.style.setProperty("--inv-color-primary", token.colors.primary);
  el.style.setProperty("--inv-color-accent", token.colors.accent);
  el.style.setProperty("--inv-color-background", token.colors.background);
  el.style.setProperty("--inv-font-heading", token.typography.heading);
  el.style.setProperty("--inv-font-body", token.typography.body);
  el.style.setProperty("--inv-border-radius", BORDER_RADIUS_MAP[token.borderRadius]);
}
