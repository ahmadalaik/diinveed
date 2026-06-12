import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGuestCategories } from "../get-guest-categories";

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

describe("getGuestCategories", () => {
  it("returns distinct non-null categories", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guest.findMany.mockResolvedValue([
      { category: "Keluarga" }, { category: null }, { category: "Teman" },
    ]);
    const result = await getGuestCategories();
    expect(result.categories).toEqual(["Keluarga", "Teman"]);
  });
});
