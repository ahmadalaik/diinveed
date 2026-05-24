"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import {
  createTransactionSchema,
  CreateTransactionType,
} from "../schemas/create-transaction";
import prisma from "@/lib/prisma";

type FieldErrors = Partial<
  Record<keyof CreateTransactionType | "_form", string[]>
>;

export type CreateTransactionActionResult =
  | { errors: FieldErrors; success?: undefined; transactionId?: undefined }
  | { errors?: undefined; success: true; transactionId: string };

function computeDiscount(
  originalPrice: number,
  discountType: string | null | undefined,
  discountValue: number | null | undefined,
) {
  if (!discountType || discountValue === null || discountValue === undefined) {
    return { discountAmount: 0, finalAmount: originalPrice };
  }

  if (discountType === "percentage") {
    const discountAmount = Math.round((originalPrice * discountValue) / 100);
    return { discountAmount, finalAmount: originalPrice - discountAmount };
  }

  return {
    discountAmount: discountValue,
    finalAmount: originalPrice - discountValue,
  };
}

export async function createTransactionAction(
  input: CreateTransactionType,
): Promise<CreateTransactionActionResult> {
  const actor = await getCurrentUser();
  if (!actor) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  if (actor.role === "user") {
    return { errors: { _form: ["Unauthorized"] } };
  }

  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FieldErrors };
  }

  const {
    userId,
    originalPrice,
    discountType,
    discountValue,
    notes,
    paymentMethod,
    paymentAmount,
    referenceNumber,
    senderName,
    senderBank,
    proofUrl,
    paymentNotes,
  } = parsed.data;

  const { discountAmount, finalAmount } = computeDiscount(
    originalPrice,
    discountType,
    discountValue,
  );
  const now = new Date();

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          userId,
          originalPrice,
          discountType: discountType ?? null,
          discountValue: discountValue ?? null,
          discountAmount,
          finalAmount,
          status: "confirmed",
          notes: notes ?? null,
          createdBy: actor.id,
          accessGrantedAt: now,
        },
        select: { id: true },
      });

      await tx.payment.create({
        data: {
          transactionId: created.id,
          method: paymentMethod,
          amount: paymentAmount,
          referenceNumber: referenceNumber ?? null,
          senderName: senderName ?? null,
          senderBank: senderBank ?? null,
          proofUrl: proofUrl ?? null,
          notes: paymentNotes ?? null,
          status: "confirmed",
          confirmedBy: actor.id,
          confirmedAt: now,
        },
      });

      return created;
    });

    return { success: true, transactionId: transaction.id };
  } catch (error) {
    console.log("Create transaction error: ", error);

    return { errors: { _form: ["Gagal membuat transaksi, coba lagi"] } };
  }
}
