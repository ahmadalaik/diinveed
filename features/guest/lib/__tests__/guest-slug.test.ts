import { describe, it, expect } from "vitest";
import { buildGuestSlug } from "../guest-slug";

describe("buildGuestSlug", () => {
  it("slugifies a normal name", () => {
    expect(buildGuestSlug("Budi Santoso")).toBe("budi-santoso");
  });
  it("strips emoji and symbols, keeping only a-z0-9", () => {
    expect(buildGuestSlug("Budi 🎉 (SMA)!!!")).toBe("budi-sma");
  });
  it("strips accents", () => {
    expect(buildGuestSlug("José Méndez")).toBe("jose-mendez");
  });
  it("returns an empty string when the name slugifies to nothing", () => {
    expect(buildGuestSlug("🎉🎉🎉")).toBe("");
  });
});
