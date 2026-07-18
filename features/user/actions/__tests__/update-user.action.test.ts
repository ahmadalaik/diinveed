import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      adminUpdateUser: vi.fn(),
      setUserPassword: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

import { updateUserAction } from "../update-user.action";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/features/auth/utils/session";
import { logAudit } from "@/lib/audit";
import { ACTION_MESSAGES } from "@/lib/action-response";

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
  };
};

const authMock = auth as unknown as {
  api: {
    adminUpdateUser: ReturnType<typeof vi.fn>;
    setUserPassword: ReturnType<typeof vi.fn>;
  };
};

const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const validInput = {
  name: "Updated Name",
  email: "updated@example.com",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateUserAction", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await updateUserAction("target-1", validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(authMock.api.adminUpdateUser).not.toHaveBeenCalled();
  });

  it("returns User not found when target does not exist", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue(null);
    const result = await updateUserAction("target-1", validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Pengguna tidak ditemukan");
    expect(authMock.api.adminUpdateUser).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when admin tries to update a super_admin", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "super_admin" });
    const result = await updateUserAction("target-1", validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(authMock.api.adminUpdateUser).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when actor tries to update themselves", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    const result = await updateUserAction("actor-1", validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(authMock.api.adminUpdateUser).not.toHaveBeenCalled();
  });

  it("allows admin to update a user-role account", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    prismaMock.user.findFirst.mockResolvedValue(null);
    authMock.api.adminUpdateUser.mockResolvedValue({});
    const result = await updateUserAction("target-1", validInput);
    expect(result.success).toBe(true);
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "user.updated",
      targetType: "user",
    }));
  });

  it("allows super_admin to update an admin", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "admin" });
    prismaMock.user.findFirst.mockResolvedValue(null);
    authMock.api.adminUpdateUser.mockResolvedValue({});
    const result = await updateUserAction("target-1", validInput);
    expect(result.success).toBe(true);
  });

  it("updates the password when one is provided", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    prismaMock.user.findFirst.mockResolvedValue(null);
    authMock.api.adminUpdateUser.mockResolvedValue({});
    authMock.api.setUserPassword.mockResolvedValue({});

    const result = await updateUserAction("target-1", {
      ...validInput,
      password: "supersecret",
    });

    expect(result.success).toBe(true);
    expect(authMock.api.setUserPassword).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({ userId: "target-1", newPassword: "supersecret" }),
      }),
    );
  });

  it("only updates the fields that are provided (PATCH)", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    authMock.api.adminUpdateUser.mockResolvedValue({});

    const result = await updateUserAction("target-1", { name: "Only Name" });

    expect(result.success).toBe(true);
    expect(authMock.api.adminUpdateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          userId: "target-1",
          data: { name: "Only Name" },
        },
      })
    );
    expect(authMock.api.setUserPassword).not.toHaveBeenCalled();
  });
});
