import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { markGuestSent } from "../mark-guest-sent";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  default: { guest: { findUnique: vi.fn(), update: vi.fn() } },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  guest: { findUnique: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };

beforeEach(() => vi.clearAllMocks());

describe("markGuestSent", () => {
  it("rejects a guest owned by someone else", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({ invitation: { userId: "other" } });
    const result = await markGuestSent("g1");
    expect(result.success).toBe(false);
    expect(result.message).toBe("Tamu tidak ditemukan");
    expect(prismaMock.guest.update).not.toHaveBeenCalled();
  });

  it("sets sentAt on an owned guest", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.guest.findUnique.mockResolvedValue({ invitation: { userId: "user-1" } });
    prismaMock.guest.update.mockResolvedValue({ id: "g1" });
    const result = await markGuestSent("g1");
    expect(result.success).toBe(true);
    expect(prismaMock.guest.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "g1" } }),
    );
    const arg = prismaMock.guest.update.mock.calls[0][0];
    expect(arg.data.sentAt).toBeInstanceOf(Date);
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "guest.marked_sent",
      targetType: "guest",
    }));
  });
});
