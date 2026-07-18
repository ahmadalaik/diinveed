"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { TEMPLATES } from "@/features/template/registry/templates";
import { TemplatePicker } from "./template-picker";

export function InitialThemeDialog() {
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const set = useInvitationStore((s) => s.set);

  const slugs = Object.keys(TEMPLATES);
  const open = templateSlug === "";

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-2xl"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Pilih Tema Undangan</DialogTitle>
          <DialogDescription>
            Pilih tema desain untuk undanganmu. Kamu masih bisa mengubahnya
            nanti di bagian pengaturan tema.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-1">
          <TemplatePicker
            value={templateSlug}
            slugs={slugs}
            onSelect={(slug) =>
              set({ templateSlug: slug, tokenOverrides: null })
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
