import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const baseTemplateSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  description: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]),
});

export const createTemplateFormSchema = baseTemplateSchema.extend({
  thumbnail: z
    .instanceof(File, { message: "Silahkan upload thumbnail" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Ukuran thumbnail maksimal 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message:
        "Format file tidak didukung (Hanya diizinkan: .jpg, .jpeg, .png, .webp)",
    }),
});

export const createTemplateActionSchema = baseTemplateSchema.extend({
  thumbnailUrl: z.url("Thumbnail wajib diisi."),
});

export type CreateTemplateFormType = z.infer<typeof createTemplateFormSchema>;

export type CreateTemplateActionType = z.infer<
  typeof createTemplateActionSchema
>;
