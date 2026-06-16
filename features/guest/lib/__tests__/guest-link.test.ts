import { describe, it, expect } from "vitest";
import { buildGuestInvitationUrl } from "../guest-link";

describe("buildGuestInvitationUrl", () => {
  it("composes baseUrl + invitation route + ?to= guest slug", () => {
    expect(
      buildGuestInvitationUrl("https://diinveed.com", "citra-rama", "budi-santoso"),
    ).toBe("https://diinveed.com/invitation/citra-rama?to=budi-santoso");
  });

  it("trims a trailing slash from baseUrl", () => {
    expect(buildGuestInvitationUrl("https://diinveed.com/", "x-1", "y")).toBe(
      "https://diinveed.com/invitation/x-1?to=y",
    );
  });
});
