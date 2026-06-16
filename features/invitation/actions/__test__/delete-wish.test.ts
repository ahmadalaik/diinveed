import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteWish } from "../delete-wish";
import { getCurrentUser } from "@/features/auth/utils/session";
import { ACTION_MESSAGES } from "@/lib/action-response";
import { logAudit } from "@/lib/audit";

vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: { guestRsvp: { findFirst: vi.fn(), delete: vi.fn() } },
}));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const userMock = getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const prismaMock = prisma as unknown as {
  guestRsvp: {
    findFirst: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => vi.clearAllMocks());

describe("deleteWish", () => {
  it("returns Unauthorized when there is no user", async () => {
    userMock.mockResolvedValue(null);
    const result = await deleteWish("r1");
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
  });

  it("returns error when the wish does not belong to the user", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue(null);
    const result = await deleteWish("r1");
    expect(result.success).toBe(false);
    expect(result.message).toBe("Ucapan tidak ditemukan");
    expect(prismaMock.guestRsvp.delete).not.toHaveBeenCalled();
  });

  it("deletes the row when owned by the user", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue({ id: "r1" });
    prismaMock.guestRsvp.delete.mockResolvedValue({ id: "r1" });
    const result = await deleteWish("r1");
    expect(prismaMock.guestRsvp.findFirst).toHaveBeenCalledWith({
      where: { id: "r1", invitation: { userId: "u1" } },
      select: { id: true },
    });
    expect(prismaMock.guestRsvp.delete).toHaveBeenCalledWith({ where: { id: "r1" } });
    expect(result.success).toBe(true);
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: "u1",
        action: "wish.deleted",
        targetType: "wish",
        targetId: "r1",
      }),
    );
  });
});
