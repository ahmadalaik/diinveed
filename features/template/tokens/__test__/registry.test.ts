import { describe, it, expect } from "vitest";
import { getToken, TOKENS, mergeTokenOverrides } from "../registry";

describe("getToken", () => {
  it("returns token for known id", () => {
    const token = getToken("aura");
    expect(token).toBeDefined();
    expect(token?.theme).toBe("aura");
    expect(token?.colors.primary).toBeDefined();
    expect(token?.typography.heading).toBeDefined();
  });

  it("returns undefined for unknown id", () => {
    expect(getToken("nonexistent")).toBeUndefined();
  });

  it("every token has required fields", () => {
    for (const token of TOKENS) {
      expect(token.theme).toBeTruthy();
      expect(token.name).toBeTruthy();
      expect(token.colors.primary).toMatch(/^#/);
      expect(token.colors.accent).toMatch(/^#/);
      expect(token.colors.background).toMatch(/^#/);
      expect(token.typography.heading).toBeTruthy();
      expect(token.typography.body).toBeTruthy();
      expect(["minimal", "rounded", "pill"]).toContain(token.borderRadius);
    }
  });
});

describe("mergeTokenOverrides", () => {
  const base = getToken("aura")!;

  it("returns token as-is when no overrides", () => {
    expect(mergeTokenOverrides(base, null)).toEqual(base);
    expect(mergeTokenOverrides(base, undefined)).toEqual(base);
  });

  it("overrides individual color fields", () => {
    const merged = mergeTokenOverrides(base, { colors: { accent: "#FF0000" } });
    expect(merged.colors.accent).toBe("#FF0000");
    expect(merged.colors.primary).toBe(base.colors.primary);
    expect(merged.colors.background).toBe(base.colors.background);
  });

  it("overrides typography fields", () => {
    const merged = mergeTokenOverrides(base, {
      typography: { heading: "Playfair Display" },
    });
    expect(merged.typography.heading).toBe("Playfair Display");
    expect(merged.typography.body).toBe(base.typography.body);
  });

  it("overrides borderRadius", () => {
    const merged = mergeTokenOverrides(base, { borderRadius: "pill" });
    expect(merged.borderRadius).toBe("pill");
  });
});
