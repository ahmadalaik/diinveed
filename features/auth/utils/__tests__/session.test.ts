import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma before importing session
vi.mock("@/lib/prisma", () => ({
  default: {
    session: {
      create: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock next/headers cookies
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
};
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

import { createSession, deleteSession, getCurrentUser } from "../session";
import prisma from "@/lib/prisma";

const prismaMock = prisma as unknown as {
  session: {
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createSession", () => {
  it("creates a session record in the database", async () => {
    prismaMock.session.create.mockResolvedValue({});

    await createSession("user-123");

    expect(prismaMock.session.create).toHaveBeenCalledOnce();
    const callArg = prismaMock.session.create.mock.calls[0][0];
    expect(callArg.data.userId).toBe("user-123");
    expect(callArg.data.tokenHash).toBeDefined();
    expect(callArg.data.expiresAt).toBeInstanceOf(Date);
  });

  it("sets the session cookie with httpOnly flag", async () => {
    prismaMock.session.create.mockResolvedValue({});

    await createSession("user-123");

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
    const [, , options] = mockCookieStore.set.mock.calls[0];
    expect(options.httpOnly).toBe(true);
  });

  it("sets session expiry to 7 days from now", async () => {
    prismaMock.session.create.mockResolvedValue({});
    const before = Date.now();

    await createSession("user-123");

    const callArg = prismaMock.session.create.mock.calls[0][0];
    const expiresAt: Date = callArg.data.expiresAt;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + sevenDaysMs - 100);
    expect(expiresAt.getTime()).toBeLessThanOrEqual(before + sevenDaysMs + 100);
  });
});

describe("deleteSession", () => {
  it("deletes the session from the database when token exists", async () => {
    mockCookieStore.get.mockReturnValue({ value: "some-token" });
    prismaMock.session.deleteMany.mockResolvedValue({});

    await deleteSession();

    expect(prismaMock.session.deleteMany).toHaveBeenCalledOnce();
  });

  it("clears the cookie regardless of token presence", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    await deleteSession();

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
    const [, value, options] = mockCookieStore.set.mock.calls[0];
    expect(value).toBe("");
    expect(new Date(options.expires).getTime()).toBeLessThan(Date.now());
  });

  it("skips database deletion when no token in cookie", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    await deleteSession();

    expect(prismaMock.session.deleteMany).not.toHaveBeenCalled();
  });
});

describe("getCurrentUser", () => {
  it("returns null when no session cookie", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const user = await getCurrentUser();

    expect(user).toBeNull();
  });

  it("returns null when session not found in database", async () => {
    mockCookieStore.get.mockReturnValue({ value: "some-token" });
    prismaMock.session.findUnique.mockResolvedValue(null);

    const user = await getCurrentUser();

    expect(user).toBeNull();
  });

  it("returns null and deletes session when expired", async () => {
    mockCookieStore.get.mockReturnValue({ value: "some-token" });
    prismaMock.session.findUnique.mockResolvedValue({
      id: "session-1",
      expiresAt: new Date(Date.now() - 1000), // expired 1 second ago
      user: { id: "user-1", email: "user@example.com" },
    });
    prismaMock.session.delete.mockResolvedValue({});

    const user = await getCurrentUser();

    expect(user).toBeNull();
    expect(prismaMock.session.delete).toHaveBeenCalledWith({
      where: { id: "session-1" },
    });
  });

  it("returns user when session is valid", async () => {
    const mockUser = { id: "user-1", email: "user@example.com" };
    mockCookieStore.get.mockReturnValue({ value: "some-token" });
    prismaMock.session.findUnique.mockResolvedValue({
      id: "session-1",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: mockUser,
    });

    const user = await getCurrentUser();

    expect(user).toEqual(mockUser);
  });
});
