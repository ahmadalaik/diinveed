import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardSummary } from "../get-dashboard-summary";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guest: { count: vi.fn() },
    guestRsvp: {
      groupBy: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guest: { count: ReturnType<typeof vi.fn> };
  guestRsvp: {
    groupBy: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    aggregate: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => vi.clearAllMocks());

describe("getDashboardSummary", () => {
  it("returns an empty summary when the user has no invitation", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(null);

    const summary = await getDashboardSummary("user-1");

    expect(summary.hasInvitation).toBe(false);
    expect(summary.invitation).toEqual({
      coupleName: "",
      isPublished: false,
      slug: "",
      nextEventDate: null,
    });
    expect(summary.guests.invited).toBe(0);
    expect(summary.sentCount).toBe(0);
    expect(summary.wishes).toEqual({ pendingCount: 0, recent: [] });
    expect(prismaMock.guest.count).not.toHaveBeenCalled();
  });

  it("aggregates invitation, guest, send, and wish data", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({
      id: "inv-1",
      slug: "ardi-nisa",
      isPublished: true,
      isBrideFirst: false,
      brideNickname: "Nisa",
      groomNickname: "Ardi",
      events: [{ date: "2099-07-12" }],
    });
    // urutan Promise.all: guest.count dipanggil utk invited lalu sentCount
    prismaMock.guest.count.mockResolvedValueOnce(10).mockResolvedValueOnce(6);
    prismaMock.guestRsvp.groupBy.mockResolvedValue([
      { response: "ACCEPT", _count: { _all: 5 } },
      { response: "MAYBE", _count: { _all: 2 } },
      { response: "DECLINE", _count: { _all: 1 } },
    ]);
    // urutan: registeredResponded, unregistered, pendingCount
    prismaMock.guestRsvp.count
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(3);
    prismaMock.guestRsvp.aggregate.mockResolvedValue({ _sum: { guests: 12 } });
    prismaMock.guestRsvp.findMany.mockResolvedValue([
      {
        id: "rsvp-1",
        name: "Budi",
        wish: "Selamat menempuh hidup baru!",
        response: "ACCEPT",
        createdAt: new Date("2026-06-09T10:00:00Z"),
      },
    ]);

    const summary = await getDashboardSummary("user-1");

    expect(summary.hasInvitation).toBe(true);
    expect(summary.invitation).toEqual({
      coupleName: "Ardi & Nisa", // groom dulu karena isBrideFirst: false
      isPublished: true,
      slug: "ardi-nisa",
      nextEventDate: "2099-07-12",
    });
    expect(summary.guests).toEqual({
      invited: 10,
      accepted: 5,
      maybe: 2,
      declined: 1,
      pending: 4,
      unregistered: 2,
      attendingHeadcount: 12,
    });
    expect(summary.sentCount).toBe(6);
    expect(summary.wishes.pendingCount).toBe(3);
    expect(summary.wishes.recent).toEqual([
      {
        id: "rsvp-1",
        name: "Budi",
        wish: "Selamat menempuh hidup baru!",
        response: "ACCEPT",
        createdAt: "2026-06-09T10:00:00.000Z",
      },
    ]);
    expect(prismaMock.guestRsvp.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5, orderBy: { createdAt: "desc" } }),
    );
  });
});
