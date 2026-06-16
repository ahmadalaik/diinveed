import z from "zod";

const emailSchema = z.email("Invalid email format");
const usernameSchema = z
  .string()
  .min(3, "Username too short")
  .regex(/^[a-zA-Z0-9_]+$/, "Invalid username characters");

export const loginSchema = z.object({
  identifier: z.union([emailSchema, usernameSchema]),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be minimum 8 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;
