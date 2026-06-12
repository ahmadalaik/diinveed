import { describe, it, expect } from "vitest";
import {
  slugifyName,
  buildCoupleSlug,
  generatePublicToken,
} from "../slug";

describe("slugifyName", () => {
  it("lowercases, strips accents/symbols, collapses to single hyphens", () => {
    expect(slugifyName("Citra & Rama!")).toBe("citra-rama");
    expect(slugifyName("  Hello   World  ")).toBe("hello-world");
    expect(slugifyName("---a__b---")).toBe("a-b");
    expect(slugifyName("")).toBe("");
  });
});

describe("buildCoupleSlug", () => {
  it("joins names with a hyphen, bride first when isBrideFirst", () => {
    expect(buildCoupleSlug("Citra", "Rama", true)).toBe("citra-rama");
    expect(buildCoupleSlug("Citra", "Rama", false)).toBe("rama-citra");
  });
  it("returns empty string when both names are blank", () => {
    expect(buildCoupleSlug("", "", true)).toBe("");
  });
});

describe("generatePublicToken", () => {
  it("returns an 8-char lowercase alphanumeric token by default", () => {
    const token = generatePublicToken();
    expect(token).toMatch(/^[0-9a-z]{8}$/);
  });
  it("honors a custom length", () => {
    expect(generatePublicToken(12)).toHaveLength(12);
  });
  it("is effectively unique across many calls", () => {
    const set = new Set(Array.from({ length: 1000 }, () => generatePublicToken()));
    expect(set.size).toBe(1000);
  });
});

