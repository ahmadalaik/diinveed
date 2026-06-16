import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getOrCreateInvitation } from "../get-or-create-invitation";
import { ACTION_MESSAGES } from "@/lib/action-response";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn(), create: vi.fn() },
    invitationDraft: { create: vi.fn() },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  invitationDraft: { create: ReturnType<typeof vi.fn> };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const mockUser = {
  id: "user-1",
  name: "Test",
  email: "test@test.com",
  role: "user" as const,
};

const baseInvitation = {
  id: "inv-1",
  userId: "user-1",
  slug: "amelia-theo",
  publicToken: "tok-1",
  isPublished: true,
  wishesOptions: {
    enabled: true,
    reviewMode: false,
    allowPublic: true,
    showCategory: false,
  },
  coverDesktopImage: "https://live/cover.webp",
  coverDesktopImageKey: "live/cover",
  coverMobileImage: "https://live/cover.webp",
  coverMobileImageKey: "live/cover",
  music: "https://live/song.mp3",
  musicKey: "live/song",
  quote: "live quote",
  quoteReference: "live ref",
  isBrideFirst: true,
  brideName: "Amelia",
  brideNickname: "Amel",
  brideDescription: "desc",
  brideImage: "https://live/bride.webp",
  brideImageKey: "live/bride",
  groomName: "Theo",
  groomNickname: "Theo",
  groomDescription: "desc",
  groomImage: "https://live/groom.webp",
  groomImageKey: "live/groom",
  title: "Amelia & Theo",
  tokenOverrides: null,
  templateSlug: "kelana",
  backgroundType: "solid",
  rsvpDeadline: "2026-09-01",
  rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: false },
  events: [],
  stories: [],
  gallery: [],
  gifts: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getOrCreateInvitation", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await getOrCreateInvitation();
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
  });

  it("creates invitation + draft when none exists", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue(null);
    prismaMock.invitation.create.mockResolvedValue({
      ...baseInvitation,
      slug: "",
      isPublished: false,
    });
    prismaMock.invitationDraft.create.mockResolvedValue({
      data: { ...baseInvitation, slug: "" },
      hasUnpublishedChanges: false,
    });

    const result = await getOrCreateInvitation();
    expect(result.success).toBe(true);
    expect(prismaMock.invitation.create).toHaveBeenCalled();
    expect(prismaMock.invitationDraft.create).toHaveBeenCalled();
    expect(result.data?.hasUnpublishedChanges).toBe(false);
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: "user-1",
        action: "invitation.created",
        targetType: "invitation",
        targetId: "inv-1",
      }),
    );
  });

  it("returns draft content with live metadata when both exist", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({
      ...baseInvitation,
      draft: {
        data: { title: "DRAFT TITLE", slug: "draft-slug", gallery: [] },
        hasUnpublishedChanges: true,
      },
    });

    const result = await getOrCreateInvitation();
    expect(result.success).toBe(true);
    expect(result.data?.title).toBe("DRAFT TITLE");
    expect(result.data?.slug).toBe("draft-slug");
    expect(result.data?.liveSlug).toBe("amelia-theo");
    expect(result.data?.isPublished).toBe(true);
    expect(result.data?.hasUnpublishedChanges).toBe(true);
    expect(logAudit).not.toHaveBeenCalledWith(
      expect.objectContaining({ action: "invitation.created" }),
    );
  });

  it("seeds a draft from live columns for legacy invitations without one", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({
      ...baseInvitation,
      draft: null,
    });
    prismaMock.invitationDraft.create.mockResolvedValue({
      data: { ...baseInvitation },
      hasUnpublishedChanges: false,
    });

    const result = await getOrCreateInvitation();
    expect(result.success).toBe(true);
    expect(prismaMock.invitationDraft.create).toHaveBeenCalled();
    expect(result.data?.title).toBe("Amelia & Theo");
    expect(result.data?.hasUnpublishedChanges).toBe(false);
  });
});
