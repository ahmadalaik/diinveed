"use client";

import { useState } from "react";
import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { TEMPLATES } from "@/features/template/registry/templates";
import { TemplatePicker, templateLabel } from "../template-picker";

export function TemplateSelectorSection({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const overrides = useInvitationStore((s) => s.tokenOverrides);
  const set = useInvitationStore((s) => s.set);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  const slugs = Object.keys(TEMPLATES);
  const hasCustomizations = !!(
    overrides &&
    ((overrides.colors && Object.keys(overrides.colors).length > 0) ||
      (overrides.typography && Object.keys(overrides.typography).length > 0))
  );

  return (
    <>
      <div
        className={
          embedded
            ? "space-y-3"
            : "flex items-center justify-between gap-2 border-b px-4 py-3"
        }
      >
        <div className="flex min-w-0 items-center gap-2">
          <LayoutTemplate className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">
            {templateLabel(templateSlug)}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={() => setOpen(true)}
        >
          Ganti template
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pilih Template</DialogTitle>
            <DialogDescription>
              Pilih desain undangan yang ingin kamu gunakan.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto p-1">
            <TemplatePicker
              value={templateSlug}
              slugs={slugs}
              onSelect={(slug) => {
                if (slug === templateSlug) {
                  setOpen(false);
                  return;
                }
                if (hasCustomizations) {
                  setPendingSlug(slug);
                  setConfirmOpen(true);
                  return;
                }
                set({ templateSlug: slug, tokenOverrides: null });
                setOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ganti Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Kustomisasi warna dan font yang telah Anda buat pada template
              saat ini akan di-reset. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingSlug(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingSlug) {
                  set({ templateSlug: pendingSlug, tokenOverrides: null });
                  setPendingSlug(null);
                }
                setConfirmOpen(false);
                setOpen(false);
              }}
            >
              Ya, ganti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { templateLabel } from "../template-picker";
