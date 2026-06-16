import { describe, it, expect } from "vitest";
import { buildGuestWhere } from "../guest-where";

describe("buildGuestWhere", () => {
  it("scopes by invitation only when no filters", () => {
    expect(buildGuestWhere("inv-1", {})).toEqual({ invitationId: "inv-1" });
  });

  it("maps status to rsvp relation filters", () => {
    expect(buildGuestWhere("inv-1", { status: "menunggu" })).toEqual({
      invitationId: "inv-1",
      rsvps: { none: {} },
    });
    expect(buildGuestWhere("inv-1", { status: "hadir" })).toEqual({
      invitationId: "inv-1",
      rsvps: { some: { response: "ACCEPT" } },
    });
  });

  it("adds category and search", () => {
    expect(buildGuestWhere("inv-1", { q: "bud", category: "Teman" })).toEqual({
      invitationId: "inv-1",
      category: "Teman",
      OR: [{ name: { contains: "bud" } }, { phoneNumber: { contains: "bud" } }],
    });
  });
});
