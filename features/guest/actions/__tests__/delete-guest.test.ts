import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteGuest } from "../delete-guest";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  default: { guest: { findUnique: vi.fn(), delete: vi.fn() } },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  guest: { findUnique: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };

beforeEach(() => vi.clearAllMocks());

describe("deleteGuest", () => {
  it("rejects when the guest belongs to another user", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({ invitation: { userId: "someone-else" } });
    const result = await deleteGuest("g1");
    expect(result.success).toBe(false);
    expect(result.message).toBe("Tamu tidak ditemukan");
    expect(prismaMock.guest.delete).not.toHaveBeenCalled();
  });

  it("deletes an owned guest", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({ invitation: { userId: "user-1" } });
    prismaMock.guest.delete.mockResolvedValue({ id: "g1" });
    const result = await deleteGuest("g1");
    expect(result.success).toBe(true);
    expect(prismaMock.guest.delete).toHaveBeenCalledWith({ where: { id: "g1" } });
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "guest.deleted",
      targetType: "guest",
    }));
  });
});
