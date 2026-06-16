import { describe, it, expect } from "vitest";
import { getOutputSize } from "@/features/invitation/lib/crop-image";

describe("getOutputSize", () => {
  it("returns the crop size unchanged when below the max edge", () => {
    expect(getOutputSize(500, 500, 800)).toEqual({ width: 500, height: 500 });
  });

  it("downscales proportionally when the longest edge exceeds max", () => {
    expect(getOutputSize(1600, 1600, 800)).toEqual({ width: 800, height: 800 });
  });

  it("preserves aspect ratio for non-square crops", () => {
    expect(getOutputSize(1600, 800, 800)).toEqual({ width: 800, height: 400 });
  });

  it("rounds to whole pixels", () => {
    expect(getOutputSize(1000, 333, 800)).toEqual({ width: 800, height: 266 });
  });
});
