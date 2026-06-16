import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRsvpResponses } from "../get-rsvp-responses";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guestRsvp: { findMany: vi.fn() },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guestRsvp: { findMany: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const mockUser = { id: "user-1", name: "Test", email: "test@test.com", role: "user" as const };
const mockRsvps = [
  { id: "r1", invitationId: "inv-1", name: "Alice", email: null, response: "ACCEPT", plusOne: false, submittedAt: new Date() },
];

beforeEach(() => { vi.clearAllMocks(); });

describe("getRsvpResponses", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await getRsvpResponses();
    expect(result.errors?._form).toContain("Unauthorized");
  });

  it("returns error when invitation not found", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue(null);
    const result = await getRsvpResponses();
    expect(result.errors?._form).toContain("Undangan tidak ditemukan");
  });

  it("returns guest RSVP list", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guestRsvp.findMany.mockResolvedValue(mockRsvps);
    const result = await getRsvpResponses();
    expect(result.responses).toEqual(mockRsvps);
  });
});