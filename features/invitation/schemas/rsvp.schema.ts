import z from "zod";

export const rsvpFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phoneNumber: z.string().optional().nullable(),
  response: z.enum(["ACCEPT", "DECLINE", "MAYBE"]),
  guests: z.string().optional(),
  hope: z.string().optional(),
});

export type RsvpFormType = z.infer<typeof rsvpFormSchema>;
