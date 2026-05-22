import z from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  username: z
    .string()
    .min(3, "Username terlalu pendek")
    .regex(/^[a-zA-Z0-9_]+$/, "Karakter tidak valid"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin", "super_admin"]),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
