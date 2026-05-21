import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const templateBaseSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  description: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]),
});

export const editTemplateFormSchema = templateBaseSchema.extend({
  thumbnail: z
    .instanceof(File, { error: "Silahkan upload thumbnail" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      error: "Ukuran thumbnail maksimal 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      error:
        "Format file tidak didukung (Hanya diizinkan: .jpg, .jpeg, .png, .webp)",
    })
    .optional(),
});

export const editTemplateActionSchema = templateBaseSchema.extend({
  thumbnailUrl: z.url("Thumbnail wajib diisi."),
});

export type EditTemplateFormType = z.infer<typeof editTemplateFormSchema>;

export type EditTemplateActionType = z.infer<typeof editTemplateActionSchema>;
