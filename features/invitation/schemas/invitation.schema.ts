import z from "zod";

const rsvpOptionsSchema = z.object({
  accept: z.boolean(),
  decline: z.boolean(),
  maybe: z.boolean(),
  plusOne: z.boolean(),
});

const eventItemSchema = z.object({
  id: z.string(),
  date: z.string().default(""),
  timeStart: z.string().default(""),
  timeEnd: z.string().default(""),
  timezone: z.string().default(""),
  title: z.string(),
  description: z.string(),
  locationName: z.string().default(""),
  mapsUrl: z.string().default(""),
});

const storyItemSchema = z.object({
  id: z.string(),
  year: z.string(),
  title: z.string(),
  body: z.string(),
});

const giftItemSchema = z.object({
  id: z.string(),
  provider: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
});

const galleryItemSchema = z.object({
  id: z.string(),
  url: z.string(),
  publicId: z.string(),
});

const tokenOverridesSchema = z
  .object({
    colors: z
      .object({
        primary: z.string().optional(),
        accent: z.string().optional(),
        background: z.string().optional(),
      })
      .optional(),
    typography: z
      .object({
        heading: z.string().optional(),
        body: z.string().optional(),
      })
      .optional(),
    borderRadius: z.enum(["minimal", "rounded", "pill"]).optional(),
    ornamentStyle: z.string().nullable().optional(),
  })
  .nullable();

export const saveInvitationSchema = z.object({
  coverImage: z.string().nullable(),
  coverImagePublicId: z.string().nullable(),
  coverTitle: z.string(),
  coverSubtitle: z.string(),
  music: z.string(),
  musicPublicId: z.string(),
  quote: z.string(),
  quoteReference: z.string(),
  brideName: z.string(),
  brideNickname: z.string(),
  brideDescription: z.string().nullable(),
  brideImage: z.string().nullable(),
  brideImagePublicId: z.string().nullable(),
  groomName: z.string(),
  groomNickname: z.string(),
  groomDescription: z.string().nullable(),
  groomImage: z.string().nullable(),
  groomImagePublicId: z.string().nullable(),
  title: z.string(),
  subtitle: z.string(),
  date: z.string(),
  time: z.string(),
  timezone: z.string().default("WIB"),
  hosts: z.string(),
  message: z.string(),
  tokenId: z.string(),
  tokenOverrides: tokenOverridesSchema,
  templateSlug: z.string().min(1),
  backgroundType: z.string(),
  dressCode: z.string(),
  rsvpDeadline: z.string(),
  rsvpOptions: rsvpOptionsSchema,
  events: z.array(eventItemSchema),
  stories: z.array(storyItemSchema),
  gallery: z.array(galleryItemSchema),
  gifts: z.array(giftItemSchema),
});

export type SaveInvitationType = z.infer<typeof saveInvitationSchema>;

export const publishReadySchema = z.object({
  title: z.string().min(1, "Nama pengantin wajib diisi"),
  date: z.string().min(1, "Tanggal pernikahan wajib diisi"),
  tokenId: z.string().min(1),
});

export type PublishReadyType = z.infer<typeof publishReadySchema>;
