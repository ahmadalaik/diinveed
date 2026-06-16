import { describe, expect, it, vi } from "vitest";

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(async () => "https://signed.example/put"),
}));
vi.mock("../client", () => ({ r2: {}, R2_BUCKET: "test-bucket" }));

import { createUploadUrl } from "../presign";

describe("createUploadUrl", () => {
  it("returns a signed url and a key for the given kind", async () => {
    const res = await createUploadUrl({
      kind: "gallery",
      ext: "webp",
      contentType: "image/webp",
      scope: { userId: "u1", invitationId: "inv1" },
    });
    expect(res.uploadUrl).toBe("https://signed.example/put");
    expect(res.key).toMatch(
      /^users\/u1\/invitations\/inv1\/gallery\/[0-9a-f-]{36}\.webp$/,
    );
  });
});
