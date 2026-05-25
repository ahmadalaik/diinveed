"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  createTransactionSchema,
  CreateTransactionType,
} from "@/features/transaction/schemas/create-transaction.schema";
import { createTransactionAction } from "@/features/transaction/actions/create-transaction.action";
import type { UserSelectItem } from "@/features/transaction/types/transaction.type";
import { formatIDR } from "@/features/transaction/utils/format";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTransactionFormProps {
  users: UserSelectItem[];
}

export function CreateTransactionForm({ users }: CreateTransactionFormProps) {
  const router = useRouter();

  const form = useForm<CreateTransactionType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      userId: "",
      originalPrice: 0,
      discountType: null,
      discountValue: null,
      notes: "",
      paymentMethod: "bank_transfer",
      paymentAmount: 0,
      referenceNumber: "",
      senderName: "",
      senderBank: "",
      proofUrl: "",
      paymentNotes: "",
    },
  });

  const originalPrice = useWatch({
    control: form.control,
    name: "originalPrice",
  });
  const discountType = useWatch({
    control: form.control,
    name: "discountType",
  });
  const discountValue = useWatch({
    control: form.control,
    name: "discountValue",
  });
  const paymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  });

  const discountAmount = (() => {
    if (!discountType || discountValue === null || discountValue === undefined)
      return 0;
    if (discountType === "percentage")
      return Math.round((originalPrice * discountValue) / 100);
    return discountValue;
  })();
  const finalAmount = Math.max(0, originalPrice - discountAmount);

  const onSubmit = async (data: CreateTransactionType) => {
    const result = await createTransactionAction(data);
    if (result.errors) {
      if (result.errors._form) {
        toast.error(result.errors._form[0]);
      }
      Object.entries(result.errors).forEach(([field, messages]) => {
        if (field !== "_form" && messages) {
          form.setError(field as keyof CreateTransactionType, {
            message: messages[0],
          });
        }
      });
      return;
    }
    toast.success("Transaksi berhasil dibuat");
    router.push("/admin/transactions");
  };

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <h2 className="text-base font-semibold">Data Transaksi</h2>
        <FieldGroup>
          <Controller
            control={form.control}
            name="userId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="userId">User</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                >
                  <SelectTrigger id="userId" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} — {u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="originalPrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="originalPrice">Harga (Rp)</FieldLabel>
                <Input
                  {...field}
                  id="originalPrice"
                  type="number"
                  min={0}
                  placeholder="500000"
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="discountType"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="discountType">Tipe Diskon</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value ?? "none"}
                  onValueChange={(v) => {
                    field.onChange(v === "none" ? null : v);
                    if (v === "none") form.setValue("discountValue", null);
                  }}
                  disabled={form.formState.isSubmitting}
                >
                  <SelectTrigger
                    id="discountType"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Tidak ada diskon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada diskon</SelectItem>
                    <SelectItem value="percentage">Persentase (%)</SelectItem>
                    <SelectItem value="fixed">Nominal Tetap (Rp)</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {discountType && (
            <Controller
              control={form.control}
              name="discountValue"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="discountValue">
                    {discountType === "percentage"
                      ? "Diskon (%)"
                      : "Diskon (Rp)"}
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="discountValue"
                    type="number"
                    min={0}
                    max={discountType === "percentage" ? 100 : undefined}
                    placeholder={discountType === "percentage" ? "20" : "50000"}
                    disabled={form.formState.isSubmitting}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          {/* Preview total */}
          {originalPrice > 0 && (
            <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga asli</span>
                <span>{formatIDR(originalPrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Diskon</span>
                  <span>-{formatIDR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-1">
                <span>Total</span>
                <span>{formatIDR(finalAmount)}</span>
              </div>
            </div>
          )}
          <Controller
            control={form.control}
            name="notes"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="notes">Catatan (opsional)</FieldLabel>
                <Textarea
                  {...field}
                  id="notes"
                  placeholder="Catatan tambahan..."
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold">Data Pembayaran</h2>
        <FieldGroup>
          <Controller
            control={form.control}
            name="paymentMethod"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="paymentMethod">
                  Metode Pembayaran
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                >
                  <SelectTrigger
                    id="paymentMethod"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Pilih metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                    <SelectItem value="e_wallet">E-Wallet</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="paymentAmount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="paymentAmount">
                  Nominal Dibayar (Rp)
                </FieldLabel>
                <Input
                  {...field}
                  id="paymentAmount"
                  type="number"
                  min={0}
                  placeholder={String(finalAmount || 0)}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="referenceNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="referenceNumber">
                  Nomor Referensi (opsional)
                </FieldLabel>
                <Input
                  {...field}
                  id="referenceNumber"
                  placeholder="REF123456"
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="senderName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="senderName">
                  Nama Pengirim (opsional)
                </FieldLabel>
                <Input
                  {...field}
                  id="senderName"
                  placeholder="Nama sesuai rekening"
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {paymentMethod === "bank_transfer" && (
            <Controller
              control={form.control}
              name="senderBank"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="senderBank">
                    Bank Pengirim (opsional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="senderBank"
                    placeholder="BCA, Mandiri, BNI..."
                    disabled={form.formState.isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            control={form.control}
            name="paymentNotes"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="paymentNotes">
                  Catatan Pembayaran (opsional)
                </FieldLabel>
                <Textarea
                  {...field}
                  id="paymentNotes"
                  placeholder="Catatan..."
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="flex gap-3">
        <Button
          asChild
          type="button"
          variant="outline"
          disabled={form.formState.isSubmitting}
        >
          <Link href="/admin/transactions">Batal</Link>
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Transaksi"
          )}
        </Button>
      </div>
    </form>
  );
}
