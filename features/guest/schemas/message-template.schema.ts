import z from "zod";

export const messageTemplateSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi").max(100, "Judul terlalu panjang"),
  body: z.string().trim().min(1, "Pesan wajib diisi").max(2000, "Pesan terlalu panjang"),
});

export type MessageTemplateType = z.infer<typeof messageTemplateSchema>;
