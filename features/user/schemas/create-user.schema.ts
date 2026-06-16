import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  username: z
    .string()
    .min(3, "Username terlalu pendek")
    .regex(/^[a-zA-Z0-9_]+$/, "Karakter tidak valid"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["user", "admin", "super_admin"]),
  phone: z.string().optional(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;
