import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { moderateWish } from "../moderate-wish";
import { getCurrentUser } from "@/features/auth/utils/session";
import { ACTION_MESSAGES } from "@/lib/action-response";
import { logAudit } from "@/lib/audit";

vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: {
    guestRsvp: { findFirst: vi.fn(), update: vi.fn() },
  },
}));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const userMock = getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const prismaMock = prisma as unknown as {
  guestRsvp: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => vi.clearAllMocks());

describe("moderateWish", () => {
  it("returns Unauthorized when there is no user", async () => {
    userMock.mockResolvedValue(null);
    const result = await moderateWish({ id: "r1", action: "approve" });
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
  });

  it("rejects an invalid action", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    // @ts-expect-error testing invalid action
    const result = await moderateWish({ id: "r1", action: "nuke" });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Aksi tidak valid");
    expect(prismaMock.guestRsvp.update).not.toHaveBeenCalled();
  });

  it("returns error when the wish does not belong to the user", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue(null);
    const result = await moderateWish({ id: "r1", action: "approve" });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Ucapan tidak ditemukan");
    expect(prismaMock.guestRsvp.update).not.toHaveBeenCalled();
  });

  it("maps approve -> APPROVED, scoped to the owner", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue({ id: "r1" });
    prismaMock.guestRsvp.update.mockResolvedValue({ id: "r1" });
    const result = await moderateWish({ id: "r1", action: "approve" });
    expect(prismaMock.guestRsvp.findFirst).toHaveBeenCalledWith({
      where: { id: "r1", invitation: { userId: "u1" } },
      select: { id: true },
    });
    expect(prismaMock.guestRsvp.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: { moderationStatus: "APPROVED" },
    });
    expect(result.success).toBe(true);
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: "u1",
        action: "wish.moderated",
        targetType: "wish",
        targetId: "r1",
        metadata: { status: "APPROVED" },
      }),
    );
  });

  it("maps hide -> HIDDEN", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue({ id: "r1" });
    prismaMock.guestRsvp.update.mockResolvedValue({ id: "r1" });
    await moderateWish({ id: "r1", action: "hide" });
    expect(prismaMock.guestRsvp.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: { moderationStatus: "HIDDEN" },
    });
  });

  it("maps show -> APPROVED", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue({ id: "r1" });
    prismaMock.guestRsvp.update.mockResolvedValue({ id: "r1" });
    await moderateWish({ id: "r1", action: "show" });
    expect(prismaMock.guestRsvp.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: { moderationStatus: "APPROVED" },
    });
  });
});
