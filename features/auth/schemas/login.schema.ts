import z from "zod";

const emailSchema = z.email("Invalid email format");

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be minimum 8 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;
