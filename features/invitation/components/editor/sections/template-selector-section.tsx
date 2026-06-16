"use client";

import { useState } from "react";
import { Check, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { TEMPLATES } from "@/features/template/registry/templates";
import { cn } from "@/lib/utils";

const TEMPLATE_LABELS: Record<string, string> = {
  kelana: "Kelana",
  terracotta: "Terracotta",
  agnimaya: "Agnimaya",
};

function templateLabel(slug: string) {
  return TEMPLATE_LABELS[slug] ?? slug;
}

export function TemplateSelectorSection() {
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const set = useInvitationStore((s) => s.set);
  const [open, setOpen] = useState(false);

  const slugs = Object.keys(TEMPLATES);

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <LayoutTemplate className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">
            {templateLabel(templateSlug)}
          </span>
        </div>
        <Button
          size="sm"
          className="shrink-0 rounded-full"
          onClick={() => setOpen(true)}
        >
          Ganti Template
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

          <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto p-1 sm:grid-cols-3">
            {slugs.map((slug) => {
              const active = slug === templateSlug;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => {
                    set({ templateSlug: slug });
                    setOpen(false);
                  }}
                  className={cn(
                    "relative flex aspect-3/4 flex-col items-center justify-end rounded-lg border-2 bg-muted/30 p-2 text-left transition-colors hover:border-primary/50",
                    active ? "border-primary" : "border-border",
                  )}
                >
                  {active && (
                    <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                  <span className="text-xs font-medium">
                    {templateLabel(slug)}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
