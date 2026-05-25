import z from "zod";

export const submitRsvpSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().optional(),
  responses: z.enum(["ACCEPT", "DECLINE", "MAYBE"]),
  plusOne: z.boolean().default(false),
});

export type SubmitRsvpType = z.infer<typeof submitRsvpSchema>;
