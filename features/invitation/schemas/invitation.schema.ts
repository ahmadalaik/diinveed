import z from "zod";
import { DEFAULT_DRESS_CODE } from "../types/invitation.type";

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

const giftTransferSchema = z.object({
  id: z.string(),
  provider: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
});

const giftPackageSchema = z.object({
  id: z.string(),
  recipientName: z.string(),
  recipientPhoneNumber: z.string(),
  address: z.string(),
});

const galleryItemSchema = z.object({
  id: z.string(),
  url: z.string(),
  key: z.string(),
});

const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const dressCodeSchema = z
  .object({
    enabled: z.boolean(),
    description: z.string(),
    colors: z.array(hexColorSchema).max(5),
  })
  .superRefine((value, ctx) => {
    if (!value.enabled) return;

    if (value.description.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["description"],
        message: "Deskripsi dress code wajib diisi",
      });
    }

    if (value.colors.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["colors"],
        message: "Pilih minimal dua warna",
      });
    }
  });

const optionalHttpsUrlSchema = z
  .string()
  .url()
  .refine(
    (value) => value.startsWith("https://"),
    "URL harus menggunakan HTTPS",
  )
  .nullable();

const colorSpecOverrideSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  tertiary: z.string().optional(),
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
        background: colorSpecOverrideSchema.optional(),
        text: colorSpecOverrideSchema.optional(),
        button: z.object({
          primary: z.object({
            text: z.string().optional(),
            background: z.string().optional(),
          }).optional(),
          secondary: z.object({
            text: z.string().optional(),
            background: z.string().optional(),
          }).optional(),
        }).optional(),
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
  title: z.string(),
  coverDesktopImage: z.string().nullable(),
  coverDesktopImageKey: z.string().nullable(),
  coverMobileImage: z.string().nullable(),
  coverMobileImageKey: z.string().nullable(),
  music: z.string(),
  musicKey: z.string(),
  musicFileName: z.string().nullable(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Hanya huruf kecil, angka, dan tanda hubung")
    .default(""),
  events: z.array(eventItemSchema),
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
  coupleSceneImage: z.string().nullable().default(null),
  coupleSceneImageKey: z.string().nullable().default(null),
  livestreamUrl: optionalHttpsUrlSchema.default(null),
  dressCode: dressCodeSchema.default(DEFAULT_DRESS_CODE),
  stories: z.object({ enabled: z.boolean(), items: z.array(storyItemSchema) }),
  gallery: z.object({
    enabled: z.boolean(),
    items: z.array(galleryItemSchema),
  }),
  gifts: z.object({
    enabled: z.boolean(),
    transfers: z.array(giftTransferSchema),
    packages: z.array(giftPackageSchema),
  }),
  rsvpDeadline: z.string(),
  rsvpOptions: rsvpOptionsSchema,
  templateSlug: z.string(),
  tokenOverrides: tokenOverridesSchema,
  backgroundType: z.string(),
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
  title: requiredText("Judul undangan wajib diisi"),
  coverDesktopImage: requiredAsset("Gambar cover desktop wajib diunggah"),
  coverMobileImage: requiredAsset("Gambar cover mobile wajib diunggah"),
  music: requiredText("Musik latar wajib diisi"),
  quote: requiredText("Kutipan wajib diisi"),
  quoteReference: requiredText("Sumber kutipan wajib diisi"),
  brideName: requiredText("Nama lengkap mempelai wanita wajib diisi"),
  brideNickname: requiredText("Nama panggilan mempelai wanita wajib diisi"),
  brideDescription: requiredAsset("Deskripsi mempelai wanita wajib diisi"),
  brideImage: requiredAsset("Foto mempelai wanita wajib diunggah"),
  groomName: requiredText("Nama lengkap mempelai pria wajib diisi"),
  groomNickname: requiredText("Nama panggilan mempelai pria wajib diisi"),
  groomDescription: requiredAsset("Deskripsi mempelai pria wajib diisi"),
  groomImage: requiredAsset("Foto mempelai pria wajib diunggah"),
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
      {
        message:
          "Lengkapi minimal satu acara (tanggal, nama acara, dan lokasi)",
      },
    ),
  stories: z
    .object({ enabled: z.boolean(), items: z.array(storyItemSchema) })
    .refine(
      (s) =>
        !s.enabled ||
        s.items.some(
          (item) => item.title.trim() !== "" || item.body.trim() !== "",
        ),
      { message: "Tambahkan minimal satu cerita yang lengkap" },
    ),
  gallery: z
    .object({ enabled: z.boolean(), items: z.array(galleryItemSchema) })
    .refine(
      (g) => !g.enabled || g.items.some((item) => item.url.trim() !== ""),
      { message: "Tambahkan minimal satu foto galeri" },
    ),
  gifts: z
    .object({
      enabled: z.boolean(),
      transfers: z.array(giftTransferSchema),
      packages: z.array(giftPackageSchema),
    })
    .refine(
      (g) =>
        !g.enabled ||
        g.transfers.some(
          (t) =>
            t.provider.trim() !== "" &&
            t.accountName.trim() !== "" &&
            t.accountNumber.trim() !== "",
        ) ||
        g.packages.some(
          (p) =>
            p.recipientName.trim() !== "" &&
            p.address.trim() !== "" &&
            p.recipientPhoneNumber.trim() !== "",
        ),
      { message: "Tambahkan minimal satu rekening/hadiah yang lengkap" },
    ),
  rsvpDeadline: requiredText("Batas waktu RSVP wajib diisi"),
  rsvpOptions: rsvpOptionsSchema.refine(
    (o) => o.accept || o.decline || o.maybe,
    { message: "Pilih minimal satu opsi kehadiran RSVP" },
  ),
  templateSlug: z.string().min(1, "Template wajib dipilih"),
  backgroundType: requiredText("Latar belakang wajib dipilih"),
});

export type PublishReadyType = z.infer<typeof publishReadySchema>;

/** Default editable content for a brand-new draft (matches saveInvitationSchema). */
export const DEFAULT_INVITATION_CONTENT: SaveInvitationType = {
  title: "Undangan Tanpa Judul",
  coverDesktopImage: null,
  coverDesktopImageKey: null,
  coverMobileImage: null,
  coverMobileImageKey: null,
  music: "",
  musicKey: "",
  musicFileName: null,
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
  coupleSceneImage: null,
  coupleSceneImageKey: null,
  livestreamUrl: null,
  dressCode: DEFAULT_DRESS_CODE,
  slug: "",
  events: [],
  stories: { enabled: true, items: [] },
  gallery: { enabled: true, items: [] },
  gifts: { enabled: true, transfers: [], packages: [] },
  rsvpDeadline: "",
  rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: false },
  templateSlug: "",
  tokenOverrides: null,
  backgroundType: "solid",
};
