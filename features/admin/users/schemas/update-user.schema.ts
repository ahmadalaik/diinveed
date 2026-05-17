import z from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(3, "Username too short")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username characters"),
  email: z.email("Invalid email format"),
  phone: z.string().optional(),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
