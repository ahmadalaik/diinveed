import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      createUser: vi.fn(),
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

import { createUserAction } from "../create-user.action";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/features/auth/utils/session";
import { logAudit } from "@/lib/audit";
import { ACTION_MESSAGES } from "@/lib/action-response";

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};

const authMock = auth as unknown as {
  api: {
    createUser: ReturnType<typeof vi.fn>;
  };
};

const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const validInput = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  role: "user" as const,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createUserAction", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await createUserAction(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(authMock.api.createUser).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when admin tries to create an admin-role user", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    const result = await createUserAction({ ...validInput, role: "admin" });
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(authMock.api.createUser).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when admin tries to create a super_admin-role user", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    const result = await createUserAction({ ...validInput, role: "super_admin" });
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(authMock.api.createUser).not.toHaveBeenCalled();
  });

  it("allows admin to create a user-role account", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue(null);
    authMock.api.createUser.mockResolvedValue({ user: { id: "new-user-1" } });
    const result = await createUserAction(validInput);
    expect(result.success).toBe(true);
    expect(result.data?.userId).toBe("new-user-1");
    expect(logAudit).toHaveBeenCalledWith(expect.objectContaining({
      action: "user.created",
      targetType: "user",
    }));
  });

  it("allows super_admin to create an admin-role account", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue(null);
    authMock.api.createUser.mockResolvedValue({ user: { id: "new-admin-1" } });
    const result = await createUserAction({ ...validInput, role: "admin" });
    expect(result.success).toBe(true);
  });

  it("returns field errors for invalid input", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    const result = await createUserAction({ ...validInput, email: "not-an-email" });
    expect(result.errors?.email).toBeDefined();
    expect(authMock.api.createUser).not.toHaveBeenCalled();
  });

  it("returns error when email is already in use", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "some-id", deletedAt: null });
    const result = await createUserAction(validInput);
    expect(result.errors?.email).toContain("Email sudah digunakan");
    expect(authMock.api.createUser).not.toHaveBeenCalled();
  });

  it("returns form error when database creation fails", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue(null);
    authMock.api.createUser.mockRejectedValue(new Error("Database error"));
    const result = await createUserAction(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.SERVER_ERROR);
  });
});
