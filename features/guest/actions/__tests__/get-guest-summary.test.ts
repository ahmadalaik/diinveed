import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGuestSummary } from "../get-guest-summary";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guest: { count: vi.fn() },
    guestRsvp: { groupBy: vi.fn(), count: vi.fn(), aggregate: vi.fn() },
  },
}));
vi.mock("@/features/auth/utils/session", () => ({ getCurrentUser: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guest: { count: ReturnType<typeof vi.fn> };
  guestRsvp: {
    groupBy: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    aggregate: ReturnType<typeof vi.fn>;
  };
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;
const mockUser = { id: "user-1", name: "T", email: "t@t.com", role: "user" as const };

beforeEach(() => vi.clearAllMocks());

describe("getGuestSummary", () => {
  it("aggregates counts into a summary", async () => {
    getCurrentUserMock.mockResolvedValue(mockUser);
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1" });
    prismaMock.guest.count.mockResolvedValue(10);
    prismaMock.guestRsvp.groupBy.mockResolvedValue([
      { response: "ACCEPT", _count: { _all: 5 } },
      { response: "MAYBE", _count: { _all: 2 } },
      { response: "DECLINE", _count: { _all: 1 } },
    ]);
    // registered responders count, then unregistered count
    prismaMock.guestRsvp.count
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(2);
    prismaMock.guestRsvp.aggregate.mockResolvedValue({ _sum: { guests: 12 } });

    const result = await getGuestSummary();

    expect(result.summary).toEqual({
      invited: 10,
      accepted: 5,
      maybe: 2,
      declined: 1,
      pending: 4,
      unregistered: 2,
      attendingHeadcount: 12,
    });
  });
});
