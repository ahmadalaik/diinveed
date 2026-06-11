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
  music: "",
  musicKey: "",
  quote: "",
  quoteReference: "",
  title: "Amelia & Theo",
  coverImage: null,
  coverImageKey: null,
  tokenId: "aura",
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
  stories: [],
  gallery: [],
  gifts: [],
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
