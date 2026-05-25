import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitRsvp } from "../submit-rsvp";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guestRsvp: { create: vi.fn() },
  },
}));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guestRsvp: { create: ReturnType<typeof vi.fn> };
};

const mockInvitation = { id: "inv-1", isPublished: true };

const validGuest = {
  name: "Alice",
  email: "alice@example.com",
  response: "ACCEPT" as const,
  plusOne: false,
  mealPreference: undefined,
};

beforeEach(() => { vi.clearAllMocks(); });

describe("submitRsvp", () => {
  it("returns error when token is invalid", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(null);
    const result = await submitRsvp("bad-token", validGuest);
    expect(result.errors?._form).toContain("Undangan tidak ditemukan");
  });

  it("returns error when invitation is not published", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1", isPublished: false });
    const result = await submitRsvp("tok-123", validGuest);
    expect(result.errors?._form).toContain("Undangan belum dipublikasikan");
  });

  it("creates GuestRsvp and returns success", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "rsvp-1" });
    const result = await submitRsvp("tok-123", validGuest);
    expect(result.success).toBe(true);
    expect(prismaMock.guestRsvp.create).toHaveBeenCalledOnce();
  });

  it("returns validation error for missing name", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
    const result = await submitRsvp("tok-123", { ...validGuest, name: "" });
    expect(result.errors).toBeDefined();
  });
});