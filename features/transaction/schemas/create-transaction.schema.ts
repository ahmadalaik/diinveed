import z from "zod";

export const createTransactionSchema = z
  .object({
    userId: z.string().min(1, "User wajib dipilih"),
    originalPrice: z.number().int().min(1, "Harga wajib diisi"),
    discountType: z.enum(["percentage", "fixed"]).nullable(),
    discountValue: z.number().int().min(0).nullable(),
    notes: z.string().optional(),
    paymentMethod: z.enum(["bank_transfer", "qris", "e_wallet", "cash"]),
    paymentAmount: z.number().int().min(1, "Nominal pembayaran wajib diisi"),
    referenceNumber: z.string().optional(),
    senderName: z.string().optional(),
    senderBank: z.string().optional(),
    proofUrl: z.string().optional(),
    paymentNotes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.discountType &&
      (data.discountValue === null || data.discountValue === undefined)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Nilai diskon wajib diisi",
        path: ["discountValue"],
      });
    }
    if (
      data.discountType === "percentage" &&
      data.discountValue !== null &&
      data.discountValue !== undefined
    ) {
      if (data.discountValue < 1 || data.discountValue > 100) {
        ctx.addIssue({
          code: "custom",
          message: "Diskon persentase harus antara 1-100",
          path: ["discountValue"],
        });
      }
    }
    if (
      data.discountType === "fixed" &&
      data.discountValue !== null &&
      data.discountValue !== undefined
    ) {
      if (data.discountValue >= data.originalPrice) {
        ctx.addIssue({
          code: "custom",
          message: "Diskon tidak boleh melebihi harga",
          path: ["discountValue"],
        });
      }
    }
  });

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;
