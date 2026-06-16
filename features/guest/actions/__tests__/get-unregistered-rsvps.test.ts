import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUnregisteredRsvps } from "../get-unregistered-rsvps";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guestRsvp: { findMany: vi.fn(), count: vi.fn() },
  },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guestRsvp: { findMany: ReturnType<typeof vi.fn>; count: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };
beforeEach(() => vi.clearAllMocks());

describe("getUnregisteredRsvps", () => {
  it("pages unregistered responses", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guestRsvp.count.mockResolvedValue(5);
    prismaMock.guestRsvp.findMany.mockResolvedValue([
      { id: "u1", name: "Tamu", phoneNumber: null, response: "MAYBE", guests: 1, wish: null, createdAt: new Date() },
    ]);
    const result = await getUnregisteredRsvps({ page: 1 });
    if (result.errors) throw new Error("unexpected error");
    expect(result.rows).toHaveLength(1);
    expect(result.total).toBe(5);
    expect(result.totalPages).toBe(1);
    expect(prismaMock.guestRsvp.findMany.mock.calls[0][0].where).toEqual({
      invitationId: "inv-1",
      guestId: null,
    });
  });
});
