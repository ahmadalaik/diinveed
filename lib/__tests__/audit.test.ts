import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: { auditLog: { create: vi.fn() } },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

import { logAudit } from "../audit";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const createMock = (prisma as unknown as {
  auditLog: { create: ReturnType<typeof vi.fn> };
}).auditLog.create;
const headersMock = headers as unknown as ReturnType<typeof vi.fn>;

function mockHeaders(map: Record<string, string>) {
  headersMock.mockResolvedValue({
    get: (k: string) => map[k.toLowerCase()] ?? null,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockHeaders({});
});

describe("logAudit", () => {
  it("write a row with IP & user-agent from header", async () => {
    mockHeaders({
      "x-forwarded-for": "203.0.113.5, 70.41.3.18",
      "user-agent": "Mozilla/5.0",
    });
    createMock.mockResolvedValue({});

    await logAudit({
      actorId: "actor-1",
      actorLabel: "Budi",
      action: "user.created",
      targetType: "user",
      targetId: "target-1",
      targetLabel: "Siti",
      metadata: { foo: "bar" },
    });

    expect(createMock).toHaveBeenCalledWith({
      data: {
        actorId: "actor-1",
        actorLabel: "Budi",
        action: "user.created",
        targetType: "user",
        targetId: "target-1",
        targetLabel: "Siti",
        metadata: { foo: "bar" },
        ipAddress: "203.0.113.5",
        userAgent: "Mozilla/5.0",
      },
    });
  });

  it("using null when header empty", async () => {
    createMock.mockResolvedValue({});
    await logAudit({ actorId: null, actorLabel: "x", action: "auth.login_failed" });
    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({ ipAddress: null, userAgent: null }),
    });
  });

  it("never throw when error prisma", async () => {
    createMock.mockRejectedValue(new Error("db down"));
    await expect(
      logAudit({ actorId: "a", actorLabel: "x", action: "user.created" }),
    ).resolves.toBeUndefined();
  });
});
