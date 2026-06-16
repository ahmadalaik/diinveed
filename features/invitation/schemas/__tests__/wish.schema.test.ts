import { describe, it, expect } from "vitest";
import {
  wishesOptionsSchema,
  moderateWishSchema,
  DEFAULT_WISHES_OPTIONS,
} from "../wish.schema";

describe("wishesOptionsSchema", () => {
  it("accepts a fully-specified options object", () => {
    const parsed = wishesOptionsSchema.safeParse({
      enabled: true,
      reviewMode: false,
      allowPublic: true,
      showCategory: false,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a non-boolean field", () => {
    const parsed = wishesOptionsSchema.safeParse({
      enabled: "yes",
      reviewMode: false,
      allowPublic: true,
      showCategory: false,
    });
    expect(parsed.success).toBe(false);
  });
});

describe("DEFAULT_WISHES_OPTIONS", () => {
  it("is a valid options object with the documented defaults", () => {
    expect(wishesOptionsSchema.safeParse(DEFAULT_WISHES_OPTIONS).success).toBe(true);
    expect(DEFAULT_WISHES_OPTIONS).toEqual({
      enabled: true,
      reviewMode: false,
      allowPublic: true,
      showCategory: false,
    });
  });
});

describe("moderateWishSchema", () => {
  it("accepts a valid action", () => {
    expect(
      moderateWishSchema.safeParse({ id: "rsvp-1", action: "approve" }).success,
    ).toBe(true);
  });

  it("rejects an unknown action", () => {
    expect(
      moderateWishSchema.safeParse({ id: "rsvp-1", action: "delete" }).success,
    ).toBe(false);
  });
});
