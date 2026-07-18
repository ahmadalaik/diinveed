import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { publishInvitation, unpublishInvitation } from "../publish-invitation";
import { ACTION_MESSAGES } from "@/lib/action-response";
import { logAudit } from "@/lib/audit";
import { DEFAULT_INVITATION_CONTENT } from "../../schemas/invitation.schema";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    invitationDraft: { update: vi.fn() },
    $transaction: vi.fn(async (ops: unknown[]) => Promise.all(ops as Promise<unknown>[])),
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: {
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  invitationDraft: { update: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const mockUser = {
  id: "user-1",
  name: "Test",
  email: "test@test.com",
  role: "user" as const,
};

const readyInvitation = {
  ...DEFAULT_INVITATION_CONTENT,
  coverDesktopImage: "https://pub-test.r2.dev/cover-desktop.webp",
  coverMobileImage: "https://pub-test.r2.dev/cover-mobile.webp",
  music: "https://pub-test.r2.dev/song.mp3",
  quote: "Dan di antara tanda-tanda kekuasaan-Nya...",
  quoteReference: "QS. Ar-Rum: 21",
  title: "Amelia & Theo",
  brideName: "Amelia",
  brideNickname: "Amelia",
  brideDescription: "Putri kedua dari Bapak Budi",
  brideImage: "https://pub-test.r2.dev/bride.webp",
  groomName: "Theo",
  groomNickname: "Theo",
  groomDescription: "Putra pertama dari Bapak Andi",
  groomImage: "https://pub-test.r2.dev/groom.webp",
  templateSlug: "kalandra",
  backgroundType: "solid",
  rsvpDeadline: "2026-09-01",
  rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: true },
  events: [
    {
      id: "evt-1",
      date: "2026-09-12",
      timeStart: "08:00",
      timeEnd: "10:00",
      timezone: "WIB",
      title: "Akad Nikah",
      description: "",
      locationName: "Gedung Serbaguna",
      mapsUrl: "",
    },
  ],
  stories: {
    enabled: true,
    items: [
      { id: "st-1", year: "2020", title: "Pertama bertemu", body: "..." },
    ],
  },
  gallery: {
    enabled: true,
    items: [
      {
        id: "g-1",
        url: "https://pub-test.r2.dev/photo.webp",
        key: "diinveed/photo",
      },
    ],
  },
  gifts: {
    enabled: true,
    transfers: [
      {
        id: "gift-1",
        provider: "BCA",
        accountName: "Amelia",
        accountNumber: "1234567890",
      },
    ],
    packages: [],
  },
  coupleSceneImage: "https://cdn.test/couple.webp",
  coupleSceneImageKey: "users/u/invitations/i/couple/couple.webp",
  livestreamUrl: "https://youtube.com/live/example",
  dressCode: {
    enabled: true,
    description: "Earth tones",
    colors: ["#334433", "#D4AF72"],
  },
};

const incompleteInvitation = {
  ...DEFAULT_INVITATION_CONTENT,
  title: "",
  backgroundType: "",
  rsvpOptions: { accept: false, decline: false, maybe: false, plusOne: false },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("publishInvitation", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await publishInvitation();
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
  });

  it("returns validation errors when required fields are empty", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({
      id: "inv-1",
      slug: "",
      brideNickname: "",
      groomNickname: "",
      isBrideFirst: true,
      draft: { data: incompleteInvitation, hasUnpublishedChanges: true },
    });
    const result = await publishInvitation();
    expect(result.errors?.coverDesktopImage).toBeDefined();
    expect(result.errors?.coverMobileImage).toBeDefined();
    expect(result.errors?.music).toBeDefined();
    expect(result.errors?.quote).toBeDefined();
    expect(result.errors?.quoteReference).toBeDefined();
    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.brideName).toBeDefined();
    expect(result.errors?.brideNickname).toBeDefined();
    expect(result.errors?.brideDescription).toBeDefined();
    expect(result.errors?.brideImage).toBeDefined();
    expect(result.errors?.groomName).toBeDefined();
    expect(result.errors?.groomNickname).toBeDefined();
    expect(result.errors?.groomDescription).toBeDefined();
    expect(result.errors?.groomImage).toBeDefined();
    expect(result.errors?.templateSlug).toBeDefined();
    expect(result.errors?.backgroundType).toBeDefined();
    expect(result.errors?.rsvpDeadline).toBeDefined();
    expect(result.errors?.rsvpOptions).toBeDefined();
    expect(result.errors?.events).toBeDefined();
    expect(result.errors?.stories).toBeDefined();
    expect(result.errors?.gallery).toBeDefined();
    expect(result.errors?.gifts).toBeDefined();
    expect(prismaMock.invitation.update).not.toHaveBeenCalled();
  });

  it("sets isPublished=true, backfills slug, and returns the bare slug", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({
      id: "inv-1",
      slug: "",
      publicToken: "7gk2mq8p",
      brideNickname: "Amelia",
      groomNickname: "Theo",
      isBrideFirst: true,
      draft: {
        data: { ...readyInvitation, slug: "", isBrideFirst: true },
        hasUnpublishedChanges: true,
      },
    });
    prismaMock.invitation.findFirst.mockResolvedValue(null);
    prismaMock.invitation.update.mockResolvedValue({ slug: "amelia-theo" });
    const result = await publishInvitation();
    expect(result.data?.invitationSlug).toBe("amelia-theo");
    expect(prismaMock.invitation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "inv-1" },
        data: expect.objectContaining({
          isPublished: true,
          slug: "amelia-theo",
          coupleSceneImage: "https://cdn.test/couple.webp",
          coupleSceneImageKey:
            "users/u/invitations/i/couple/couple.webp",
          livestreamUrl: "https://youtube.com/live/example",
          dressCode: {
            enabled: true,
            description: "Earth tones",
            colors: ["#334433", "#D4AF72"],
          },
        }),
      }),
    );
    expect(prismaMock.invitationDraft.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { invitationId: "inv-1" },
        data: { hasUnpublishedChanges: false },
      }),
    );
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: "user-1",
        action: "invitation.published",
        targetType: "invitation",
        targetId: "inv-1",
      }),
    );
  });

  it("rejects publish when the slug is already taken by another invitation", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({
      id: "inv-1",
      slug: "amelia-theo",
      publicToken: "7gk2mq8p",
      brideNickname: "Amelia",
      groomNickname: "Theo",
      isBrideFirst: true,
      draft: {
        data: { ...readyInvitation, slug: "amelia-theo", isBrideFirst: true },
        hasUnpublishedChanges: true,
      },
    });
    prismaMock.invitation.findFirst.mockResolvedValue({ id: "other-inv" });
    const result = await publishInvitation();
    expect(result.errors?.slug).toContain("URL undangan sudah dipakai, silakan ganti");
    expect(prismaMock.invitation.update).not.toHaveBeenCalled();
  });
});

describe("unpublishInvitation", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await unpublishInvitation();
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
  });

  it("sets isPublished=false and returns success", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.update.mockResolvedValue({ id: "inv-1" });
    const result = await unpublishInvitation();
    expect(result.success).toBe(true);
  });
});
