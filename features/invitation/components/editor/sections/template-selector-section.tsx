"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { TEMPLATES } from "@/features/template/registry/templates";

const TEMPLATE_LABELS: Record<string, string> = {
  kelana: "Kelana",
};

export function TemplateSelectorSection() {
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const set = useInvitationStore((s) => s.set);

  const slugs = Object.keys(TEMPLATES);

  return (
    <ToggleGroup
      type="single"
      value={templateSlug}
      onValueChange={(v) => {
        if (v) set({ templateSlug: v });
      }}
      className="grid grid-cols-3 gap-2"
    >
      {slugs.map((slug) => (
        <ToggleGroupItem
          key={slug}
          value={slug}
          className="rounded-lg border-2 p-2 flex flex-col items-center gap-1 h-auto data-[state=on]:border-primary"
        >
          <span className="text-xs font-medium">
            {TEMPLATE_LABELS[slug] ?? slug}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
