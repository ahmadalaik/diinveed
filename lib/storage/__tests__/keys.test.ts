import { describe, expect, it } from "vitest";
import { buildKey } from "../keys";

const scope = { userId: "u1", invitationId: "inv1" };

describe("buildKey", () => {
  it("nests gallery images under users/<userId>/invitations/<invitationId>/gallery", () => {
    expect(buildKey("gallery", "webp", scope)).toMatch(
      /^users\/u1\/invitations\/inv1\/gallery\/[0-9a-f-]{36}\.webp$/,
    );
  });

  it("nests cover images the same way", () => {
    expect(buildKey("cover", "webp", scope)).toMatch(
      /^users\/u1\/invitations\/inv1\/cover\/[0-9a-f-]{36}\.webp$/,
    );
  });

  it("keeps the original extension for music", () => {
    expect(buildKey("music", "mp3", scope)).toMatch(
      /^users\/u1\/invitations\/inv1\/music\/[0-9a-f-]{36}\.mp3$/,
    );
  });

  it("keeps template thumbnails flat under templates/thumbnail (no scope needed)", () => {
    expect(buildKey("thumbnail", "webp")).toMatch(
      /^templates\/thumbnail\/[0-9a-f-]{36}\.webp$/,
    );
  });

  it("throws when an invitation-scoped kind is missing its scope", () => {
    expect(() => buildKey("gallery", "webp")).toThrow();
  });
});
