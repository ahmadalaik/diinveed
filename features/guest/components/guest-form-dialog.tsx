"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  guestFormSchema,
  GuestFormInput,
  GuestFormType,
} from "../schemas/guest.schema";
import { createGuest } from "../actions/create-guest";
import { updateGuest } from "../actions/update-guest";
import { applyServerErrors } from "@/lib/apply-server-errors";
import type { GuestWithRsvp } from "../types/guest.type";

type Props = {
  mode: "create" | "edit";
  trigger: React.ReactNode;
  guest?: GuestWithRsvp;
  categories: string[];
};

export function GuestFormDialog({ mode, trigger, guest, categories }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<GuestFormInput, unknown, GuestFormType>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: guest?.name ?? "",
      phoneNumber: guest?.phoneNumber ?? "",
      invitedCount: guest?.invitedCount ?? 1,
      category: guest?.category ?? "",
    },
  });

  const onSubmit = async (data: GuestFormType) => {
    const result =
      mode === "create"
        ? await createGuest(data)
        : await updateGuest(guest!.id, data);

    if (!result.success) {
      toast.error(result.message);
      applyServerErrors(form.setError, result.errors);
      return;
    }

    toast.success(result.message);
    setOpen(false);
    if (mode === "create") form.reset({ name: "", phoneNumber: "", invitedCount: 1, category: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Tamu" : "Edit Tamu"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="guest-name">Nama</FieldLabel>
              <Input id="guest-name" {...form.register("name")} />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="guest-phone">No. WhatsApp (opsional)</FieldLabel>
              <Input
                id="guest-phone"
                placeholder="08xxxxxxxxxx"
                {...form.register("phoneNumber")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="guest-count">Jumlah pax</FieldLabel>
              <Input
                id="guest-count"
                type="number"
                min={1}
                {...form.register("invitedCount")}
              />
              {form.formState.errors.invitedCount && (
                <FieldError>
                  {form.formState.errors.invitedCount.message}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="guest-category">Kategori (opsional)</FieldLabel>
              <Input
                id="guest-category"
                list="guest-category-options"
                placeholder="mis. Keluarga, Teman"
                {...form.register("category")}
              />
              <datalist id="guest-category-options">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan…" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
