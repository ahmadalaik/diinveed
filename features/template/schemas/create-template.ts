import z from "zod";

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  category: z.string().min(1, "Kategory wajib diisi"),
  description: z.string().optional(),
  thumbnailUrl: z.url("Thumbnail wajib diisi."),
  status: z.enum(["active", "draft", "archived"]),
});

export type CreateTemplateType = z.infer<typeof createTemplateSchema>;
