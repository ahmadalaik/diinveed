import prisma from "@/lib/prisma";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitRsvp } from "../submit-rsvp";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  default: {
    invitation: { findUnique: vi.fn() },
    guest: { findFirst: vi.fn() },
    guestRsvp: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

const prismaMock = prisma as unknown as {
  invitation: { findUnique: ReturnType<typeof vi.fn> };
  guest: { findFirst: ReturnType<typeof vi.fn> };
  guestRsvp: {
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const mockInvitation = {
  id: "inv-1",
  isPublished: true,
  wishesOptions: { enabled: true, reviewMode: false, allowPublic: true, showCategory: false },
};

const validGuest = {
  name: "Alice",
  email: "alice@example.com",
  response: "ACCEPT" as const,
  plusOne: false,
};

beforeEach(() => { vi.clearAllMocks(); });

describe("submitRsvp", () => {
  it("returns error when token is invalid", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(null);
    const result = await submitRsvp("bad-token", validGuest);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Undangan tidak ditemukan");
  });

  it("returns error when invitation is not published", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1", isPublished: false });
    const result = await submitRsvp("tok-123", validGuest);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Undangan belum dipublikasikan");
  });

  it("creates GuestRsvp and returns success", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "rsvp-1" });
    const result = await submitRsvp("tok-123", validGuest);
    expect(result.success).toBe(true);
    expect(prismaMock.guestRsvp.create).toHaveBeenCalledOnce();
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: null,
        action: "rsvp.submitted",
        targetType: "invitation",
        targetId: "inv-1",
      }),
    );
  });

  it("looks up the invitation by publicToken", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "rsvp-1" });
    await submitRsvp("7gk2mq8p", validGuest);
    expect(prismaMock.invitation.findUnique).toHaveBeenCalledWith({
      where: { publicToken: "7gk2mq8p" },
      select: { id: true, isPublished: true, wishesOptions: true },
    });
  });

  it("returns validation error for missing name", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
    const result = await submitRsvp("tok-123", { ...validGuest, name: "" });
    expect(result.errors).toBeDefined();
  });

  it("creates an unregistered response (guestId null) when no guestSlug", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1", isPublished: true });
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "r1" });

    await submitRsvp("7gk2mq8p", validGuest);

    expect(prismaMock.guest.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.guestRsvp.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ invitationId: "inv-1" }) }),
    );
    const createArg = prismaMock.guestRsvp.create.mock.calls[0][0];
    expect(createArg.data.guestId).toBeUndefined();
  });

  it("links a new response to a resolved guest", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1", isPublished: true });
    prismaMock.guest.findFirst.mockResolvedValue({ id: "g1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue(null);
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "r1" });

    await submitRsvp("7gk2mq8p", validGuest, "guest-slug");

    expect(prismaMock.guest.findFirst).toHaveBeenCalledWith({
      where: { slug: "guest-slug", invitationId: "inv-1" },
      select: { id: true },
    });
    expect(prismaMock.guestRsvp.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ guestId: "g1" }) }),
    );
  });

  it("upserts (updates) an existing response for the same guest", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1", isPublished: true });
    prismaMock.guest.findFirst.mockResolvedValue({ id: "g1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue({ id: "existing-rsvp" });
    prismaMock.guestRsvp.update.mockResolvedValue({ id: "existing-rsvp" });

    await submitRsvp("7gk2mq8p", validGuest, "guest-slug");

    expect(prismaMock.guestRsvp.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "existing-rsvp" } }),
    );
    expect(prismaMock.guestRsvp.create).not.toHaveBeenCalled();
  });

  it("creates an unregistered response when guestSlug does not resolve", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({ id: "inv-1", isPublished: true });
    prismaMock.guest.findFirst.mockResolvedValue(null);
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "r1" });

    await submitRsvp("7gk2mq8p", validGuest, "unknown-slug");

    const createArg = prismaMock.guestRsvp.create.mock.calls[0][0];
    expect(createArg.data.guestId).toBeUndefined();
  });

  it("selects wishesOptions when looking up the invitation", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "r1" });
    await submitRsvp("7gk2mq8p", validGuest);
    expect(prismaMock.invitation.findUnique).toHaveBeenCalledWith({
      where: { publicToken: "7gk2mq8p" },
      select: { id: true, isPublished: true, wishesOptions: true },
    });
  });

  it("stores moderationStatus APPROVED when reviewMode is off", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "r1" });
    await submitRsvp("7gk2mq8p", validGuest);
    const createArg = prismaMock.guestRsvp.create.mock.calls[0][0];
    expect(createArg.data.moderationStatus).toBe("APPROVED");
  });

  it("stores moderationStatus PENDING when reviewMode is on", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({
      ...mockInvitation,
      wishesOptions: { enabled: true, reviewMode: true, allowPublic: true, showCategory: false },
    });
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "r1" });
    await submitRsvp("7gk2mq8p", validGuest);
    const createArg = prismaMock.guestRsvp.create.mock.calls[0][0];
    expect(createArg.data.moderationStatus).toBe("PENDING");
  });

  it("defaults to APPROVED when wishesOptions is null", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({ ...mockInvitation, wishesOptions: null });
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "r1" });
    await submitRsvp("7gk2mq8p", validGuest);
    const createArg = prismaMock.guestRsvp.create.mock.calls[0][0];
    expect(createArg.data.moderationStatus).toBe("APPROVED");
  });

  it("rejects a non-registered submission when allowPublic is false", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({
      ...mockInvitation,
      wishesOptions: { enabled: true, reviewMode: false, allowPublic: false, showCategory: false },
    });
    const result = await submitRsvp("7gk2mq8p", validGuest);
    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Hanya tamu terdaftar yang dapat mengirim ucapan.",
    );
    expect(prismaMock.guestRsvp.create).not.toHaveBeenCalled();
  });

  it("allows a registered guest when allowPublic is false", async () => {
    prismaMock.invitation.findUnique.mockResolvedValue({
      ...mockInvitation,
      wishesOptions: { enabled: true, reviewMode: false, allowPublic: false, showCategory: false },
    });
    prismaMock.guest.findFirst.mockResolvedValue({ id: "g1" });
    prismaMock.guestRsvp.findFirst.mockResolvedValue(null);
    prismaMock.guestRsvp.create.mockResolvedValue({ id: "r1" });
    const result = await submitRsvp("7gk2mq8p", validGuest, "guest-slug");
    expect(result.success).toBe(true);
    const createArg = prismaMock.guestRsvp.create.mock.calls[0][0];
    expect(createArg.data.guestId).toBe("g1");
  });
});