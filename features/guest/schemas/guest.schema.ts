import z from "zod";

export const guestFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phoneNumber: z.string().trim().optional(),
  invitedCount: z.coerce.number().int().min(1, "Minimal 1").default(1),
  category: z.string().trim().optional(),
});

export type GuestFormType = z.infer<typeof guestFormSchema>;
export type GuestFormInput = z.input<typeof guestFormSchema>;
