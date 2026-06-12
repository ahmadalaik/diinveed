import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGuests } from "../get-guests";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guest: { findMany: vi.fn(), count: vi.fn() },
  },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guest: { findMany: ReturnType<typeof vi.fn>; count: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };

beforeEach(() => vi.clearAllMocks());

describe("getGuests", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await getGuests({});
    expect(result.errors?._form).toContain("Unauthorized");
  });

  it("pages, filters by status, and maps the latest rsvp", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({
      id: "inv-1",
      slug: "citra-rama",
    });
    prismaMock.guest.count.mockResolvedValue(25);
    prismaMock.guest.findMany.mockResolvedValue([
      {
        id: "g1", slug: "abc", name: "Budi", phoneNumber: "0812",
        invitedCount: 2, category: "Teman", sentAt: null,
        rsvps: [{ response: "ACCEPT", guests: 2, wish: "Selamat", createdAt: new Date("2026-01-01") }],
      },
    ]);

    const result = await getGuests({ page: 2, status: "hadir", q: "bud", category: "Teman" });

    if (result.errors) throw new Error("unexpected error");
    expect(result.guests).toHaveLength(1);
    expect(result.guests[0].category).toBe("Teman");
    expect(result.guests[0].rsvp?.response).toBe("ACCEPT");
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3); // 25 / 10
    expect(result.page).toBe(2);
    expect(result.invitationSlug).toBe("citra-rama");

    const findArgs = prismaMock.guest.findMany.mock.calls[0][0];
    expect(findArgs.skip).toBe(10);
    expect(findArgs.take).toBe(10);
    expect(findArgs.where).toEqual({
      invitationId: "inv-1",
      rsvps: { some: { response: "ACCEPT" } },
      category: "Teman",
      OR: [{ name: { contains: "bud" } }, { phoneNumber: { contains: "bud" } }],
    });
  });
});
