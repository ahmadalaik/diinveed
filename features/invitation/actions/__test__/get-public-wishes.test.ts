import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPublicWishes } from "../get-public-wishes";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guestRsvp: { findMany: vi.fn(), count: vi.fn() },
  },
}));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guestRsvp: {
    findMany: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
};

const enabledInvitation = {
  id: "inv-1",
  isPublished: true,
  wishesOptions: { enabled: true, reviewMode: false, allowPublic: true, showCategory: true },
};

beforeEach(() => vi.clearAllMocks());

describe("getPublicWishes", () => {
  it("returns error when the invitation does not exist", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(null);
    const result = await getPublicWishes("bad-token");
    expect(result.errors?._form).toContain("Undangan tidak ditemukan");
  });

  it("returns an empty wall when wishes are disabled", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({
      ...enabledInvitation,
      wishesOptions: { ...enabledInvitation.wishesOptions, enabled: false },
    });
    const result = await getPublicWishes("tok-123");
    expect(result.wishes).toEqual([]);
    expect(prismaMock.guestRsvp.findMany).not.toHaveBeenCalled();
  });

  it("queries only APPROVED non-empty wishes, newest first", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(enabledInvitation);
    prismaMock.guestRsvp.findMany.mockResolvedValue([
      {
        id: "r1",
        name: "Alice",
        wish: "Congrats!",
        createdAt: new Date("2026-06-01"),
        guest: { category: "Keluarga" },
      },
    ]);
    prismaMock.guestRsvp.count.mockResolvedValue(1);

    const result = await getPublicWishes("tok-123");

    expect(prismaMock.guestRsvp.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { invitationId: "inv-1", moderationStatus: "APPROVED", wish: { not: "" } },
        orderBy: { createdAt: "desc" },
        include: { guest: { select: { category: true } } },
      }),
    );
    expect(result.wishes?.[0]).toEqual({
      id: "r1",
      name: "Alice",
      wish: "Congrats!",
      category: "Keluarga",
      createdAt: new Date("2026-06-01"),
    });
    expect(result.showCategory).toBe(true);
  });
});
