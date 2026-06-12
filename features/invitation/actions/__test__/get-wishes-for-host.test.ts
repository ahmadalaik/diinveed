import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getWishesForHost } from "../get-wishes-for-host";
import { getCurrentUser } from "@/features/auth/utils/session";

vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guestRsvp: { findMany: vi.fn(), count: vi.fn() },
  },
}));

const userMock = getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guestRsvp: {
    findMany: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => vi.clearAllMocks());

describe("getWishesForHost", () => {
  it("returns Unauthorized when there is no user", async () => {
    userMock.mockResolvedValue(null);
    const result = await getWishesForHost({});
    expect(result.errors?._form).toContain("Unauthorized");
  });

  it("returns error when the user has no invitation", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.invitation.findUnique.mockResolvedValue(null);
    const result = await getWishesForHost({});
    expect(result.errors?._form).toContain("Undangan tidak ditemukan");
  });

  it("lists wishes scoped to the invitation and maps category", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guestRsvp.findMany.mockResolvedValue([
      {
        id: "r1",
        name: "Alice",
        wish: "Congrats!",
        response: "ACCEPT",
        guests: 2,
        moderationStatus: "PENDING",
        createdAt: new Date("2026-06-01"),
        guest: { category: "Teman" },
      },
    ]);
    prismaMock.guestRsvp.count.mockResolvedValue(1);

    const result = await getWishesForHost({ status: "PENDING" });

    const findManyArg = prismaMock.guestRsvp.findMany.mock.calls[0][0];
    expect(findManyArg.where).toEqual({
      invitationId: "inv-1",
      wish: { not: "" },
      moderationStatus: "PENDING",
    });
    expect(result.rows?.[0]).toEqual({
      id: "r1",
      name: "Alice",
      wish: "Congrats!",
      response: "ACCEPT",
      guests: 2,
      category: "Teman",
      moderationStatus: "PENDING",
      createdAt: new Date("2026-06-01"),
    });
    expect(result.counts).toBeDefined();
  });

  it("omits the moderationStatus filter when status is not provided", async () => {
    userMock.mockResolvedValue({ id: "u1" });
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guestRsvp.findMany.mockResolvedValue([]);
    prismaMock.guestRsvp.count.mockResolvedValue(0);

    await getWishesForHost({});

    const findManyArg = prismaMock.guestRsvp.findMany.mock.calls[0][0];
    expect(findManyArg.where).toEqual({ invitationId: "inv-1", wish: { not: "" } });
  });
});
