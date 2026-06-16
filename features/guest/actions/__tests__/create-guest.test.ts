import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createGuest } from "../create-guest";
import { logAudit } from "@/lib/audit";
import { ACTION_MESSAGES } from "@/lib/action-response";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guest: { findFirst: vi.fn(), create: vi.fn() },
  },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guest: { findFirst: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };

beforeEach(() => vi.clearAllMocks());

describe("createGuest", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await createGuest({ name: "Budi", invitedCount: 1 });
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
  });

  it("returns validation error for empty name", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    const result = await createGuest({ name: "", invitedCount: 1 });
    expect(result.errors?.name).toBeDefined();
    expect(prismaMock.guest.create).not.toHaveBeenCalled();
  });

  it("creates a guest with a name-derived slug scoped to the invitation", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guest.findFirst.mockResolvedValue(null);
    prismaMock.guest.create.mockResolvedValue({ id: "g1" });

    const result = await createGuest({ name: "Budi Santoso", phoneNumber: "0812", invitedCount: 2, category: "Teman" });

    expect(result.success).toBe(true);
    expect(prismaMock.guest.create).toHaveBeenCalledWith({
      data: {
        invitationId: "inv-1",
        slug: "budi-santoso",
        name: "Budi Santoso",
        phoneNumber: "0812",
        invitedCount: 2,
        category: "Teman",
      },
    });
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "guest.created",
      targetType: "guest",
    }));
  });

  it("rejects a duplicate guest name within the invitation", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guest.findFirst.mockResolvedValue({ id: "existing" });

    const result = await createGuest({ name: "Budi", invitedCount: 1 });

    expect(result.errors?.name?.[0]).toContain("Nama tamu sudah ada");
    expect(prismaMock.guest.create).not.toHaveBeenCalled();
  });

  it("rejects a name that slugifies to empty", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });

    const result = await createGuest({ name: "🎉🎉", invitedCount: 1 });

    expect(result.errors?.name?.[0]).toContain("tidak valid");
    expect(prismaMock.guest.create).not.toHaveBeenCalled();
  });
});
