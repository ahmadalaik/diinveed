import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateGuest } from "../update-guest";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  default: { guest: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() } },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  guest: {
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };

beforeEach(() => vi.clearAllMocks());

describe("updateGuest", () => {
  it("rejects when the guest belongs to another user", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({
      invitationId: "inv-1",
      invitation: { userId: "someone-else" },
    });
    const result = await updateGuest("g1", { name: "Budi", invitedCount: 1 });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Tamu tidak ditemukan");
    expect(prismaMock.guest.update).not.toHaveBeenCalled();
  });

  it("updates an owned guest and recomputes the slug", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({
      invitationId: "inv-1",
      invitation: { userId: "user-1" },
    });
    prismaMock.guest.findFirst.mockResolvedValue(null);
    prismaMock.guest.update.mockResolvedValue({ id: "g1" });
    const result = await updateGuest("g1", { name: "Budi Hartono", phoneNumber: "0813", invitedCount: 3, category: "Teman" });
    expect(result.success).toBe(true);
    expect(prismaMock.guest.update).toHaveBeenCalledWith({
      where: { id: "g1" },
      data: { slug: "budi-hartono", name: "Budi Hartono", phoneNumber: "0813", invitedCount: 3, category: "Teman" },
    });
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "guest.updated",
      targetType: "guest",
    }));
  });

  it("excludes the guest's own id from the duplicate check", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({
      invitationId: "inv-1",
      invitation: { userId: "user-1" },
    });
    prismaMock.guest.findFirst.mockResolvedValue(null);
    prismaMock.guest.update.mockResolvedValue({ id: "g1" });
    await updateGuest("g1", { name: "Budi", invitedCount: 1 });
    expect(prismaMock.guest.findFirst).toHaveBeenCalledWith({
      where: { invitationId: "inv-1", slug: "budi", id: { not: "g1" } },
      select: { id: true },
    });
  });

  it("rejects a duplicate guest name within the invitation", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({
      invitationId: "inv-1",
      invitation: { userId: "user-1" },
    });
    prismaMock.guest.findFirst.mockResolvedValue({ id: "other" });
    const result = await updateGuest("g1", { name: "Budi", invitedCount: 1 });
    expect(result.errors?.name?.[0]).toContain("Nama tamu sudah ada");
    expect(prismaMock.guest.update).not.toHaveBeenCalled();
  });

  it("rejects a name that slugifies to empty", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({
      invitationId: "inv-1",
      invitation: { userId: "user-1" },
    });
    const result = await updateGuest("g1", { name: "🎉", invitedCount: 1 });
    expect(result.errors?.name?.[0]).toContain("tidak valid");
    expect(prismaMock.guest.update).not.toHaveBeenCalled();
  });
});
