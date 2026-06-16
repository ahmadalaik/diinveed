import { describe, it, expect } from "vitest";
import { guestFormSchema } from "../guest.schema";

describe("guestFormSchema", () => {
  it("accepts a valid guest and coerces invitedCount", () => {
    const result = guestFormSchema.safeParse({
      name: "Budi",
      phoneNumber: "0812",
      invitedCount: "2",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.invitedCount).toBe(2);
  });

  it("defaults invitedCount to 1 when omitted", () => {
    const result = guestFormSchema.safeParse({ name: "Budi" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.invitedCount).toBe(1);
  });

  it("rejects an empty name", () => {
    const result = guestFormSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invitedCount below 1", () => {
    const result = guestFormSchema.safeParse({ name: "Budi", invitedCount: 0 });
    expect(result.success).toBe(false);
  });

  it("accepts an optional category and trims it", () => {
    const parsed = guestFormSchema.parse({ name: "Budi", category: "  Keluarga  " });
    expect(parsed.category).toBe("Keluarga");
  });

  it("allows omitting category", () => {
    const parsed = guestFormSchema.parse({ name: "Budi" });
    expect(parsed.category).toBeUndefined();
  });
});
