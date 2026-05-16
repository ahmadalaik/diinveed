import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  createSession: vi.fn(),
}));

vi.mock("@/features/auth/utils/password", () => ({
  verifyPassword: vi.fn(),
}));

import { loginAction } from "../login.action";
import prisma from "@/lib/prisma";
import { createSession } from "@/features/auth/utils/session";
import { verifyPassword } from "@/features/auth/utils/password";

const prismaMock = prisma as unknown as {
  user: { findFirst: ReturnType<typeof vi.fn> };
};
const verifyPasswordMock = verifyPassword as ReturnType<typeof vi.fn>;
const createSessionMock = createSession as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

const validInput = { identifier: "user@example.com", password: "password123" };

describe("loginAction", () => {
  describe("schema validation", () => {
    it("returns field errors when password is too short", async () => {
      const result = await loginAction({
        identifier: "user@example.com",
        password: "short",
      });

      expect(result.errors).toBeDefined();
      expect(result.errors?.password).toBeDefined();
    });

    it("does not query the database when input is invalid", async () => {
      await loginAction({ identifier: "user@example.com", password: "sh" });

      expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
    });
  });

  describe("user lookup", () => {
    it("returns _form error when user is not found", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await loginAction(validInput);

      expect(result.errors?._form).toContain(
        "Invalid username/email or password",
      );
    });

    it("returns _form error when password is wrong", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: "user-1",
        password: "hashed",
        role: "user",
        status: "active",
      });
      verifyPasswordMock.mockResolvedValue(false);

      const result = await loginAction(validInput);

      expect(result.errors?._form).toContain(
        "Invalid username/email or password",
      );
    });

    it("returns _form error when account is not active", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: "user-1",
        password: "hashed",
        role: "user",
        status: "inactive",
      });
      verifyPasswordMock.mockResolvedValue(true);

      const result = await loginAction(validInput);

      expect(result.errors?._form).toContain("This account is not active");
    });
  });

  describe("successful login", () => {
    it("returns success and redirectTo for active user with correct credentials", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: "user-1",
        password: "hashed",
        role: "user",
        status: "active",
      });
      verifyPasswordMock.mockResolvedValue(true);
      createSessionMock.mockResolvedValue(undefined);

      const result = await loginAction(validInput);

      expect(result.success).toBe(true);
      expect(result.redirectTo).toBe("/dashboard");
    });

    it("redirects admin to /admin/dashboard", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: "admin-1",
        password: "hashed",
        role: "admin",
        status: "active",
      });
      verifyPasswordMock.mockResolvedValue(true);
      createSessionMock.mockResolvedValue(undefined);

      const result = await loginAction(validInput);

      expect(result.redirectTo).toBe("/admin/dashboard");
    });

    it("creates a session on successful login", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: "user-1",
        password: "hashed",
        role: "user",
        status: "active",
      });
      verifyPasswordMock.mockResolvedValue(true);
      createSessionMock.mockResolvedValue(undefined);

      await loginAction(validInput);

      expect(createSessionMock).toHaveBeenCalledWith("user-1");
    });
  });

  describe("unexpected errors", () => {
    it("returns _form error when database throws", async () => {
      prismaMock.user.findFirst.mockRejectedValue(new Error("DB down"));

      const result = await loginAction(validInput);

      expect(result.errors?._form).toContain("Login failed, please try again");
    });
  });
});
