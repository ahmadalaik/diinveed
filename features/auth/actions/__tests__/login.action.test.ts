import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      signOut: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

import { loginAction } from "../login.action";
import { getCurrentUser } from "../../utils/session";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const signOutMock = auth.api.signOut as unknown as ReturnType<typeof vi.fn>;
const logAuditMock = logAudit as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loginAction", () => {
  it("fails if getCurrentUser is null", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await loginAction();
    expect(result.success).toBe(false);
  });

  it("signs out and fails if user is inactive", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "1", status: "inactive" });
    const result = await loginAction();
    expect(result.success).toBe(false);
    expect(signOutMock).toHaveBeenCalled();
  });

  it("logs audit and returns redirectTo on success", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: "1",
      role: "admin",
      name: "Admin",
      status: "active",
    });
    const result = await loginAction();
    expect(result.success).toBe(true);
    expect(logAuditMock).toHaveBeenCalledWith(
      expect.objectContaining({ action: "auth.login" }),
    );
    expect(result.data?.redirectTo).toBe("/admin/dashboard");
  });
});
