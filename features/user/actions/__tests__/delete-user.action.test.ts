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

import { deleteUserAction } from "../delete-user.action";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";

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

describe("deleteUserAction", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await deleteUserAction("target-1");
    expect(result.errors?._form).toContain("Unauthorized");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns User not found when target does not exist", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue(null);
    const result = await deleteUserAction("target-1");
    expect(result.errors?._form).toContain("User not found");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when admin tries to delete a super_admin", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "super_admin" });
    const result = await deleteUserAction("target-1");
    expect(result.errors?._form).toContain("Unauthorized");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when admin tries to delete another admin", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "admin" });
    const result = await deleteUserAction("target-1");
    expect(result.errors?._form).toContain("Unauthorized");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when actor tries to delete themselves", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    const result = await deleteUserAction("actor-1");
    expect(result.errors?._form).toContain("Unauthorized");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("soft-deletes when admin deletes a user-role account", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    prismaMock.user.update.mockResolvedValue({});
    const result = await deleteUserAction("target-1");
    expect(result.success).toBe(true);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "target-1" },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it("soft-deletes when super_admin deletes an admin", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "admin" });
    prismaMock.user.update.mockResolvedValue({});
    const result = await deleteUserAction("target-1");
    expect(result.success).toBe(true);
  });

  it("returns _form error when database throws", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    prismaMock.user.update.mockRejectedValue(new Error("DB error"));
    const result = await deleteUserAction("target-1");
    expect(result.errors?._form).toContain("Failed to delete user, please try again");
  });
});
