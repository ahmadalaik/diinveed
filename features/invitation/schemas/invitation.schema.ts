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
  key: z.string(),
});

const fontSpecOverrideSchema = z
  .object({
    family: z.string().optional(),
    size: z.string().optional(),
    weight: z.number().optional(),
    transform: z
      .enum(["none", "uppercase", "capitalize", "lowercase"])
      .optional(),
  })
  .optional();

const tokenOverridesSchema = z
  .object({
    colors: z
      .object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        tertiary: z.string().optional(),
      })
      .optional(),
    typography: z
      .object({
        display: fontSpecOverrideSchema,
        heading: fontSpecOverrideSchema,
        body: fontSpecOverrideSchema,
      })
      .optional(),
  })
  .nullable();

export const saveInvitationSchema = z.object({
  coverImage: z.string().nullable(),
  coverImageKey: z.string().nullable(),
  music: z.string(),
  musicKey: z.string(),
  quote: z.string(),
  quoteReference: z.string(),
  isBrideFirst: z.boolean(),
  brideName: z.string(),
  brideNickname: z.string(),
  brideDescription: z.string().nullable(),
  brideImage: z.string().nullable(),
  brideImageKey: z.string().nullable(),
  groomName: z.string(),
  groomNickname: z.string(),
  groomDescription: z.string().nullable(),
  groomImage: z.string().nullable(),
  groomImageKey: z.string().nullable(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Hanya huruf kecil, angka, dan tanda hubung")
    .default(""),
  title: z.string(),
  tokenId: z.string(),
  tokenOverrides: tokenOverridesSchema,
  templateSlug: z.string().min(1),
  backgroundType: z.string(),
  rsvpDeadline: z.string(),
  rsvpOptions: rsvpOptionsSchema,
  events: z.array(eventItemSchema),
  stories: z.array(storyItemSchema),
  gallery: z.array(galleryItemSchema),
  gifts: z.array(giftItemSchema),
});

export type SaveInvitationType = z.infer<typeof saveInvitationSchema>;

/** Non-empty (trimmed) text. */
const requiredText = (message: string) => z.string().trim().min(1, message);

/** Nullable asset URL that must be present and non-empty. */
const requiredAsset = (message: string) =>
  z
    .string()
    .nullable()
    .refine((v) => v != null && v.trim() !== "", { message });

// Mirrors every user-filled column of saveInvitationSchema 1:1, all required.
// Excluded by design: *Key (auto-managed upload metadata), isBrideFirst
// (boolean), tokenOverrides (optional design override), slug (built at publish).
export const publishReadySchema = z.object({
  coverImage: requiredAsset("Gambar sampul wajib diunggah"),
  music: requiredText("Musik latar wajib diisi"),
  quote: requiredText("Kutipan wajib diisi"),
  quoteReference: requiredText("Sumber kutipan wajib diisi"),
  title: requiredText("Judul undangan wajib diisi"),
  brideName: requiredText("Nama lengkap mempelai wanita wajib diisi"),
  brideNickname: requiredText("Nama panggilan mempelai wanita wajib diisi"),
  brideDescription: requiredAsset("Deskripsi mempelai wanita wajib diisi"),
  brideImage: requiredAsset("Foto mempelai wanita wajib diunggah"),
  groomName: requiredText("Nama lengkap mempelai pria wajib diisi"),
  groomNickname: requiredText("Nama panggilan mempelai pria wajib diisi"),
  groomDescription: requiredAsset("Deskripsi mempelai pria wajib diisi"),
  groomImage: requiredAsset("Foto mempelai pria wajib diunggah"),
  templateSlug: z.string().min(1, "Template wajib dipilih"),
  backgroundType: requiredText("Latar belakang wajib dipilih"),
  rsvpDeadline: requiredText("Batas waktu RSVP wajib diisi"),
  rsvpOptions: rsvpOptionsSchema.refine(
    (o) => o.accept || o.decline || o.maybe,
    { message: "Pilih minimal satu opsi kehadiran RSVP" },
  ),
  events: z
    .array(eventItemSchema)
    .refine(
      (events) =>
        events.some(
          (e) =>
            e.date.trim() !== "" &&
            e.title.trim() !== "" &&
            e.locationName.trim() !== "",
        ),
      { message: "Lengkapi minimal satu acara (tanggal, nama acara, dan lokasi)" },
    ),
  stories: z
    .array(storyItemSchema)
    .refine((stories) => stories.some((s) => s.title.trim() !== "" || s.body.trim() !== ""), {
      message: "Tambahkan minimal satu cerita",
    }),
  gallery: z
    .array(galleryItemSchema)
    .refine((gallery) => gallery.some((g) => g.url.trim() !== ""), {
      message: "Tambahkan minimal satu foto galeri",
    }),
  gifts: z
    .array(giftItemSchema)
    .refine(
      (gifts) =>
        gifts.some(
          (g) =>
            g.provider.trim() !== "" &&
            g.accountName.trim() !== "" &&
            g.accountNumber.trim() !== "",
        ),
      { message: "Tambahkan minimal satu rekening/hadiah yang lengkap" },
    ),
});

export type PublishReadyType = z.infer<typeof publishReadySchema>;

/** Default editable content for a brand-new draft (matches saveInvitationSchema). */
export const DEFAULT_INVITATION_CONTENT: SaveInvitationType = {
  coverImage: null,
  coverImageKey: null,
  music: "",
  musicKey: "",
  quote: "",
  quoteReference: "",
  isBrideFirst: true,
  brideName: "",
  brideNickname: "",
  brideDescription: null,
  brideImage: null,
  brideImageKey: null,
  groomName: "",
  groomNickname: "",
  groomDescription: null,
  groomImage: null,
  groomImageKey: null,
  slug: "",
  title: "",
  tokenId: "aura",
  tokenOverrides: null,
  templateSlug: "kelana",
  backgroundType: "solid",
  rsvpDeadline: "",
  rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: false },
  events: [],
  stories: [],
  gallery: [],
  gifts: [],
};
