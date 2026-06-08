import { describe, it, expect } from "vitest";
import {
  slugifyName,
  buildCoupleSlug,
  generatePublicToken,
  buildInvitationSlug,
  parsePublicToken,
} from "../slug";

describe("slugifyName", () => {
  it("lowercases, strips accents/symbols, collapses to single hyphens", () => {
    expect(slugifyName("Citra & Rama!")).toBe("citra-rama");
    expect(slugifyName("  Hello   World  ")).toBe("hello-world");
    expect(slugifyName("---a__b---")).toBe("a-b");
    expect(slugifyName("")).toBe("");
  });
});

describe("buildCoupleSlug", () => {
  it("joins names with 'dan', bride first when isBrideFirst", () => {
    expect(buildCoupleSlug("Citra", "Rama", true)).toBe("citra-dan-rama");
    expect(buildCoupleSlug("Citra", "Rama", false)).toBe("rama-dan-citra");
  });
  it("returns empty string when both names are blank", () => {
    expect(buildCoupleSlug("", "", true)).toBe("");
  });
});

describe("generatePublicToken", () => {
  it("returns an 8-char lowercase alphanumeric token by default", () => {
    const token = generatePublicToken();
    expect(token).toMatch(/^[0-9a-z]{8}$/);
  });
  it("honors a custom length", () => {
    expect(generatePublicToken(12)).toHaveLength(12);
  });
  it("is effectively unique across many calls", () => {
    const set = new Set(Array.from({ length: 1000 }, () => generatePublicToken()));
    expect(set.size).toBe(1000);
  });
});

describe("buildInvitationSlug", () => {
  it("joins slug and token with a hyphen", () => {
    expect(buildInvitationSlug("citra-dan-rama", "7gk2mq8p")).toBe(
      "citra-dan-rama-7gk2mq8p",
    );
  });
  it("returns just the token when slug is empty", () => {
    expect(buildInvitationSlug("", "7gk2mq8p")).toBe("7gk2mq8p");
  });
});

describe("parsePublicToken", () => {
  it("extracts the substring after the last hyphen", () => {
    expect(parsePublicToken("citra-dan-rama-7gk2mq8p")).toBe("7gk2mq8p");
  });
  it("returns the whole segment when there is no hyphen", () => {
    expect(parsePublicToken("7gk2mq8p")).toBe("7gk2mq8p");
  });
});
