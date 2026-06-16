import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveInvitation } from "../save-invitation";
import { ACTION_MESSAGES } from "@/lib/action-response";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    invitationDraft: { update: vi.fn() },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  invitationDraft: { update: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const mockUser = {
  id: "user-1",
  name: "Test",
  email: "test@test.com",
  role: "user" as const,
};

const validInput = {
  music: "",
  musicKey: "",
  quote: "",
  quoteReference: "",
  title: "Amelia & Theo",
  coverDesktopImage: null,
  coverDesktopImageKey: null,
  coverMobileImage: null,
  coverMobileImageKey: null,
  tokenOverrides: null,
  templateSlug: "kelana",
  backgroundType: "solid",
  rsvpDeadline: "2026-08-01",
  rsvpOptions: {
    accept: true,
    decline: true,
    maybe: true,
    plusOne: false,
    meal: false,
  },
  events: [],
  stories: { enabled: true, items: [] },
  gallery: { enabled: true, items: [] },
  gifts: { enabled: true, transfers: [], packages: [] },
  isBrideFirst: true,
  slug: "amelia-theo",
  brideName: "Amelia",
  brideNickname: "Amel",
  brideDescription: null,
  brideImage: null,
  brideImageKey: null,
  groomName: "Theo",
  groomNickname: "Theo",
  groomDescription: null,
  groomImage: null,
  groomImageKey: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("saveInvitation", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await saveInvitation(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
  });

  it("writes the draft and flags unpublished changes", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.invitationDraft.update.mockResolvedValue({ id: "draft-1" });
    const result = await saveInvitation(validInput);
    expect(result.success).toBe(true);
    expect(prismaMock.invitationDraft.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { invitationId: "inv-1" },
        data: expect.objectContaining({ hasUnpublishedChanges: true }),
      }),
    );
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: "user-1",
        action: "invitation.saved",
        targetType: "invitation",
        targetId: "inv-1",
      }),
    );
  });

  it("returns failure when no invitation exists", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue(null);
    const result = await saveInvitation(validInput);
    expect(result.success).toBe(false);
    expect(prismaMock.invitationDraft.update).not.toHaveBeenCalled();
  });

  it("returns validation error for invalid input", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    const result = await saveInvitation({
      ...validInput,
      rsvpOptions: null as never,
    });
    expect(result.errors).toBeDefined();
  });
});
