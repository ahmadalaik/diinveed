import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Better Auth
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

import { getCurrentUser } from "../session";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};
const authMock = auth as unknown as {
  api: {
    getSession: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getCurrentUser", () => {
  it("returns null when no session cookie", async () => {
    authMock.api.getSession.mockReturnValue(undefined);

    const user = await getCurrentUser();
    expect(user).toBeNull();
  });

  it("returns null when session not found in database", async () => {
    authMock.api.getSession.mockReturnValue({
      user: {
        id: "user-1",
      },
    });
    prismaMock.user.findUnique.mockResolvedValue(null);

    const user = await getCurrentUser();
    expect(user).toBeNull();
  });

  it("returns full user with UserRole casting when valid", async () => {
    authMock.api.getSession.mockResolvedValue({
      user: {
        id: "user-1",
      },
    });
    const mockUser = { id: "user-1", role: "admin" };
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const user = await getCurrentUser();
    expect(user).toEqual(mockUser);
  });
});
