import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(3, "Username too short")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username characters"),
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be minimum 8 characters"),
  role: z.enum(["user", "admin", "super_admin"]),
  phone: z.string().optional(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;
