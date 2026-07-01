import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

import { superAdminIsRequired } from "../middleware";
import { getCurrentUser } from "../session";
import { redirect } from "next/navigation";
// Mocks are resolved by module path: "../session" from this test file
// resolves to the same module as middleware.ts's "./session" import.

const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const redirectMock = redirect as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe("superAdminIsRequired", () => {
  it("redirect ke /login saat belum login", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    await expect(superAdminIsRequired()).rejects.toThrow("REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("redirect ke /admin/dashboard saat admin biasa", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "a", role: "admin" });
    await expect(superAdminIsRequired()).rejects.toThrow("REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("mengembalikan user saat super_admin", async () => {
    const user = { id: "a", role: "super_admin" };
    getCurrentUserMock.mockResolvedValue(user);
    await expect(superAdminIsRequired()).resolves.toBe(user);
  });
});
