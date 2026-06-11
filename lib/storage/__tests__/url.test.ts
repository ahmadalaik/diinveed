import { describe, expect, it, vi, beforeEach } from "vitest";

describe("publicUrl", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_R2_PUBLIC_URL", "https://pub-abc.r2.dev");
  });

  it("joins the base url and key", async () => {
    const { publicUrl } = await import("../url");
    expect(publicUrl("invitations/gallery/x.webp")).toBe(
      "https://pub-abc.r2.dev/invitations/gallery/x.webp",
    );
  });
});
