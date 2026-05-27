import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getOrCreateInvitation } from "../get-or-create-invitation";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

const prismaMock = prisma as unknown as {
  invitation: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const mockUser = { id: "user-1", name: "Test", email: "test@test.com", role: "user" as const };

const mockInvitation = {
  id: "inv-1",
  userId: "user-1",
  token: "tok-123",
  title: "",
  subtitle: "are getting married",
  date: "", time: "", hosts: "", message: "",
  venueName: "", venueAddress: "",
  coverImage: null,
  tokenId: "aura", tokenOverrides: null,
  backgroundType: "solid",
  dressCode: "", rsvpDeadline: "",
  rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: false, meal: false },
  events: [], stories: [], gallery: [], stickers: [], gifts: [],
  isPublished: false,
  createdAt: new Date(), updatedAt: new Date(),
};

beforeEach(() => { vi.clearAllMocks(); });

describe("getOrCreateInvitation", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await getOrCreateInvitation();
    expect(result.errors?._form).toContain("Unauthorized");
  });

  it("returns existing invitation when found", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
    const result = await getOrCreateInvitation();
    expect(result.invitation).toEqual(mockInvitation);
    expect(prismaMock.invitation.create).not.toHaveBeenCalled();
  });

  it("creates new invitation when none exists", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue(null);
    prismaMock.invitation.create.mockResolvedValue(mockInvitation);
    const result = await getOrCreateInvitation();
    expect(result.invitation).toEqual(mockInvitation);
    expect(prismaMock.invitation.create).toHaveBeenCalledOnce();
  });
});