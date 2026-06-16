import { describe, it, expect } from "vitest";
import { guestStatus } from "../guest-status";
import type { GuestWithRsvp } from "../../types/guest.type";

function guest(over: Partial<GuestWithRsvp>): GuestWithRsvp {
  return {
    id: "g", slug: "s", name: "n", phoneNumber: null,
    invitedCount: 1, category: null, sentAt: null, rsvp: null, ...over,
  };
}

describe("guestStatus", () => {
  it("is 'pending-unsent' when no RSVP and not yet sent", () => {
    expect(guestStatus(guest({}))).toEqual({ key: "pending-unsent", label: "Belum dikirim" });
  });
  it("is 'pending-sent' when sent but no RSVP", () => {
    expect(guestStatus(guest({ sentAt: new Date() }))).toEqual({ key: "pending-sent", label: "Terkirim" });
  });
  it("maps ACCEPT/DECLINE/MAYBE", () => {
    expect(guestStatus(guest({ rsvp: { response: "ACCEPT", guests: 1, wish: null, createdAt: new Date() } })).key).toBe("accepted");
    expect(guestStatus(guest({ rsvp: { response: "DECLINE", guests: 1, wish: null, createdAt: new Date() } })).key).toBe("declined");
    expect(guestStatus(guest({ rsvp: { response: "MAYBE", guests: 1, wish: null, createdAt: new Date() } })).key).toBe("maybe");
  });
});
