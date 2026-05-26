import { describe, it, expect, vi } from "vitest";
import { applyTokens, BORDER_RADIUS_MAP } from "../apply";
import type { InvitationToken } from "../types";

const mockToken: InvitationToken = {
  theme: "test",
  name: "Test",
  colors: { primary: "#111111", accent: "#222222", background: "#333333" },
  typography: { heading: "Georgia", body: "Inter" },
  borderRadius: "rounded",
};

describe("applyTokens", () => {
  it("sets all CSS custom properties on the element", () => {
    const setProp = vi.fn();
    const el = { style: { setProperty: setProp } } as unknown as HTMLElement;

    applyTokens(mockToken, el);

    expect(setProp).toHaveBeenCalledWith("--inv-color-primary", "#111111");
    expect(setProp).toHaveBeenCalledWith("--inv-color-accent", "#222222");
    expect(setProp).toHaveBeenCalledWith("--inv-color-background", "#333333");
    expect(setProp).toHaveBeenCalledWith("--inv-font-heading", "Georgia");
    expect(setProp).toHaveBeenCalledWith("--inv-font-body", "Inter");
    expect(setProp).toHaveBeenCalledWith("--inv-border-radius", BORDER_RADIUS_MAP["rounded"]);
  });

  it("resolves borderRadius to pixel value", () => {
    expect(BORDER_RADIUS_MAP.minimal).toBe("4px");
    expect(BORDER_RADIUS_MAP.rounded).toBe("12px");
    expect(BORDER_RADIUS_MAP.pill).toBe("9999px");
  });
});