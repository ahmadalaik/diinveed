import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { publishInvitation, unpublishInvitation } from "../publish-invitation";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { update: vi.fn() },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

const prismaMock = prisma as unknown as {
  invitation: { update: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const mockUser = {
  id: "user-1",
  name: "Test",
  email: "test@test.com",
  role: "user" as const,
};

beforeEach(() => { vi.clearAllMocks(); });

describe("publishInvitation", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await publishInvitation();
    expect(result.errors?._form).toContain("Unauthorized");
  });

  it("sets isPublished=true and returns token", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.update.mockResolvedValue({ token: "tok-123" });
    const result = await publishInvitation();
    expect(result.token).toBe("tok-123");
    expect(prismaMock.invitation.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isPublished: true } })
    );
  });
});

describe("unpublishInvitation", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await unpublishInvitation();
    expect(result.errors?._form).toContain("Unauthorized");
  });

  it("sets isPublished=false and returns success", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.update.mockResolvedValue({ id: "inv-1" });
    const result = await unpublishInvitation();
    expect(result.success).toBe(true);
  });
});
