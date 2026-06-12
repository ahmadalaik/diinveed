import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateWishesOptions } from "../update-wishes-options";
import { getCurrentUser } from "@/features/auth/utils/session";
import { ACTION_MESSAGES } from "@/lib/action-response";
import { logAudit } from "@/lib/audit";

vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: { invitation: { update: vi.fn() } },
}));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const userMock = getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const prismaMock = prisma as unknown as {
  invitation: { update: ReturnType<typeof vi.fn> };
};

const validOptions = {
  enabled: true,
  reviewMode: true,
  allowPublic: false,
  showCategory: true,
};

beforeEach(() => vi.clearAllMocks());

describe("updateWishesOptions", () => {
  it("returns Unauthorized when there is no user", async () => {
    userMock.mockResolvedValue(null);
    const result = await updateWishesOptions(validOptions);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
  });

  it("rejects invalid options", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    // @ts-expect-error testing invalid shape
    const result = await updateWishesOptions({ enabled: "yes" });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Pengaturan tidak valid");
    expect(prismaMock.invitation.update).not.toHaveBeenCalled();
  });

  it("persists valid options scoped to the user's invitation", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.invitation.update.mockResolvedValue({ id: "inv-1" });
    const result = await updateWishesOptions(validOptions);
    expect(prismaMock.invitation.update).toHaveBeenCalledWith({
      where: { userId: "u1" },
      data: { wishesOptions: validOptions },
    });
    expect(result.success).toBe(true);
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: "u1",
        action: "invitation.wishes_options_updated",
        targetType: "invitation",
        targetId: "inv-1",
      }),
    );
  });
});
