import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

import { updateUserAction } from "../update-user.action";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const validInput = {
  name: "Updated Name",
  username: "updateduser",
  email: "updated@example.com",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateUserAction", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await updateUserAction("target-1", validInput);
    expect(result.errors?._form).toContain("Unauthorized");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns User not found when target does not exist", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue(null);
    const result = await updateUserAction("target-1", validInput);
    expect(result.errors?._form).toContain("User not found");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when admin tries to update a super_admin", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "super_admin" });
    const result = await updateUserAction("target-1", validInput);
    expect(result.errors?._form).toContain("Unauthorized");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when actor tries to update themselves", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    const result = await updateUserAction("actor-1", validInput);
    expect(result.errors?._form).toContain("Unauthorized");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("allows admin to update a user-role account", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "user" });
    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.user.update.mockResolvedValue({});
    const result = await updateUserAction("target-1", validInput);
    expect(result.success).toBe(true);
  });

  it("allows super_admin to update an admin", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "super_admin" });
    prismaMock.user.findUnique.mockResolvedValue({ id: "target-1", role: "admin" });
    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.user.update.mockResolvedValue({});
    const result = await updateUserAction("target-1", validInput);
    expect(result.success).toBe(true);
  });
});
