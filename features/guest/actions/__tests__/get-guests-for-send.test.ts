import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGuestsForSend } from "../get-guests-for-send";

vi.mock("@/lib/prisma", () => ({
  default: { invitation: { findUnique: vi.fn() }, guest: { findMany: vi.fn() } },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guest: { findMany: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };
beforeEach(() => vi.clearAllMocks());

describe("getGuestsForSend", () => {
  it("scopes by ids when given", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guest.findMany.mockResolvedValue([
      { id: "g1", name: "Budi", phoneNumber: "0812", slug: "abc" },
    ]);
    const result = await getGuestsForSend({ ids: ["g1"] });
    expect(result.guests).toHaveLength(1);
    expect(prismaMock.guest.findMany.mock.calls[0][0].where).toEqual({
      invitationId: "inv-1",
      id: { in: ["g1"] },
    });
  });

  it("falls back to filter when no ids", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guest.findMany.mockResolvedValue([]);
    await getGuestsForSend({ filter: { status: "menunggu" } });
    expect(prismaMock.guest.findMany.mock.calls[0][0].where).toEqual({
      invitationId: "inv-1",
      rsvps: { none: {} },
    });
  });
});
