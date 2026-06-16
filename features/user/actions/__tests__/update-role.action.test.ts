import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
}));

import { updateRoleAction } from "../update-role.action";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";
import { logAudit } from "@/lib/audit";
import { ACTION_MESSAGES } from "@/lib/action-response";

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateRoleAction", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await updateRoleAction("target-1", "user");
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns User not found when target does not exist", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue(null);
    const result = await updateRoleAction("target-1", "user");
    expect(result.success).toBe(false);
    expect(result.message).toBe("Pengguna tidak ditemukan");
  });

  it("returns Unauthorized when admin tries to change a super_admin role", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "super_admin" });
    const result = await updateRoleAction("target-1", "user");
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when admin tries to assign admin role", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    const result = await updateRoleAction("target-1", "admin");
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when actor tries to change their own role", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    const result = await updateRoleAction("actor-1", "user");
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("allows admin to change a user role to user (no-op)", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    prismaMock.user.update.mockResolvedValue({});
    const result = await updateRoleAction("target-1", "user");
    expect(result.success).toBe(true);
  });

  it("allows super_admin to promote a user to admin", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    prismaMock.user.update.mockResolvedValue({});
    const result = await updateRoleAction("target-1", "admin");
    expect(result.success).toBe(true);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "target-1" },
      data: { role: "admin" },
    });
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "user.role_updated",
      targetType: "user",
      targetId: "target-1",
      metadata: { from: "user", to: "admin" },
    }));
  });
});
