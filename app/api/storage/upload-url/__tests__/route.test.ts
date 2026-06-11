import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("@/lib/storage/presign", () => ({
  createUploadUrl: vi.fn(async () => ({
    uploadUrl: "https://signed.example/put",
    key: "users/u1/invitations/inv1/gallery/x.webp",
  })),
}));
vi.mock("@/lib/storage/url", () => ({
  publicUrl: (key: string) => `https://pub.r2.dev/${key}`,
}));

import { POST } from "../route";
import { getCurrentUser } from "@/features/auth/utils/session";

function req(body: unknown) {
  return new Request("http://localhost/api/storage/upload-url", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/storage/upload-url", () => {
  beforeEach(() => vi.clearAllMocks());

  it("401 when unauthenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    const res = await POST(req({ kind: "gallery", ext: "webp", contentType: "image/webp" }));
    expect(res.status).toBe(401);
  });

  it("400 when kind is invalid", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u1" } as never);
    const res = await POST(req({ kind: "bogus", ext: "webp", contentType: "image/webp" }));
    expect(res.status).toBe(400);
  });

  it("400 when ext or contentType is missing", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u1" } as never);
    const res = await POST(req({ kind: "gallery" }));
    expect(res.status).toBe(400);
  });

  it("400 when an invitation-scoped kind is missing invitationId", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u1" } as never);
    const res = await POST(req({ kind: "gallery", ext: "webp", contentType: "image/webp" }));
    expect(res.status).toBe(400);
  });

  it("returns uploadUrl, key, publicUrl for an invitation-scoped upload", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u1" } as never);
    const res = await POST(
      req({ kind: "gallery", ext: "webp", contentType: "image/webp", invitationId: "inv1" }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      uploadUrl: "https://signed.example/put",
      key: "users/u1/invitations/inv1/gallery/x.webp",
      publicUrl: "https://pub.r2.dev/users/u1/invitations/inv1/gallery/x.webp",
    });
  });

  it("allows thumbnail uploads without an invitationId (unscoped)", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "u1" } as never);
    const res = await POST(req({ kind: "thumbnail", ext: "webp", contentType: "image/webp" }));
    expect(res.status).toBe(200);
  });
});
