import { describe, expect, it } from "vitest";
import {
  clampLightboxZoom,
  formatLightboxCounter,
  getLoopedLightboxIndex,
} from "../lightbox-utils";

describe("Dikara lightbox utilities", () => {
  it("loops gallery navigation from first to last and last to first", () => {
    expect(getLoopedLightboxIndex(0, -1, 13)).toBe(12);
    expect(getLoopedLightboxIndex(12, 1, 13)).toBe(0);
  });

  it("keeps gallery navigation inside the available images", () => {
    expect(getLoopedLightboxIndex(4, 1, 13)).toBe(5);
    expect(getLoopedLightboxIndex(4, -1, 13)).toBe(3);
    expect(getLoopedLightboxIndex(4, 0, 0)).toBe(0);
  });

  it("clamps zoom to the supported range", () => {
    expect(clampLightboxZoom(25)).toBe(50);
    expect(clampLightboxZoom(100)).toBe(100);
    expect(clampLightboxZoom(275)).toBe(200);
  });

  it("formats one-based lightbox counters", () => {
    expect(formatLightboxCounter(0, 13)).toBe("1 / 13");
    expect(formatLightboxCounter(12, 13)).toBe("13 / 13");
  });
});
