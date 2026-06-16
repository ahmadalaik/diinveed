import z from "zod";
import { createUserSchema } from "./create-user.schema";

// Edit user follows PATCH semantics: every field — including password — is
// optional, so only the fields actually sent get validated and updated.
export const updateUserSchema = createUserSchema.partial();

export type UpdateUserType = z.infer<typeof updateUserSchema>;
