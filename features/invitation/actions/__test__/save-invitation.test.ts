import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveInvitation } from "../save-invitation";

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

const validInput = {
  title: "Amelia & Theo",
  subtitle: "are getting married",
  date: "2026-09-12",
  time: "16:00",
  hosts: "The Families",
  message: "Join us!",
  venueName: "Rose Garden",
  venueAddress: "123 Main St",
  coverImage: null,
  tokenId: "aura",
  tokenOverrides: null,
  templateSlug: "kelana",
  backgroundType: "solid",
  dressCode: "Black Tie",
  rsvpDeadline: "2026-08-01",
  rsvpOptions: {
    accept: true,
    decline: true,
    maybe: true,
    plusOne: false,
    meal: false,
  },
  events: [],
  stories: [],
  gallery: [],
  stickers: [],
  gifts: [],
  brideName: "Amelia",
  brideNickname: "Amel",
  brideDescription: null,
  brideImage: null,
  brideImagePublicId: null,
  groomName: "Theo",
  groomNickname: "Theo",
  groomDescription: null,
  groomImage: null,
  groomImagePublicId: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("saveInvitation", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await saveInvitation(validInput);
    expect(result.errors?._form).toContain("Unauthorized");
  });

  it("updates invitation and returns success", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.update.mockResolvedValue({ id: "inv-1" });
    const result = await saveInvitation(validInput);
    expect(result.success).toBe(true);
    expect(prismaMock.invitation.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    );
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
