import { describe, it, expect } from "vitest";
import { saveInvitationSchema } from "@/features/invitation/schemas/invitation.schema";

const base = {
  music: "",
  musicKey: "",
  quote: "",
  quoteReference: "",
  title: "",
  coverImage: null,
  coverImageKey: null,
  tokenOverrides: null,
  templateSlug: "kalandra",
  backgroundType: "solid",
  rsvpDeadline: "",
  rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: true },
  events: [],
  stories: [],
  gallery: [],
  gifts: [],
  isBrideFirst: true,
  brideName: "Citra",
  brideNickname: "Citra",
  brideDescription: "Putri kedua",
  brideImage: "https://pub-test.r2.dev/bride.webp",
  brideImageKey: "diinveed/bride",
  groomName: "Deni",
  groomNickname: "Deni",
  groomDescription: null,
  groomImage: null,
  groomImageKey: null,
};

describe("saveInvitationSchema couple fields", () => {
  it("accepts a payload containing bride and groom fields", () => {
    const result = saveInvitationSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("accepts null image and description fields", () => {
    const result = saveInvitationSchema.safeParse({
      ...base,
      brideImage: null,
      brideImageKey: null,
      brideDescription: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-string brideName", () => {
    const result = saveInvitationSchema.safeParse({ ...base, brideName: 123 });
    expect(result.success).toBe(false);
  });
});

describe("saveInvitationSchema gallery", () => {
  it("accepts gallery items shaped as { id, url, key }", () => {
    const result = saveInvitationSchema.safeParse({
      ...base,
      gallery: [
        {
          id: "photo-1",
          url: "https://pub-test.r2.dev/photo.webp",
          key: "diinveed/photo",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects gallery items that are bare strings", () => {
    const result = saveInvitationSchema.safeParse({
      ...base,
      gallery: ["https://pub-test.r2.dev/photo.webp"],
    });
    expect(result.success).toBe(false);
  });
});
