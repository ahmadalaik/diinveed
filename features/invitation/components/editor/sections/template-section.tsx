"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";

export function TemplateSection() {
  const templateSlug = useInvitationStore((s) => s.templateSlug);

  return (
    <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
      Template aktif:{" "}
      <span className="font-medium text-foreground capitalize">{templateSlug}</span>
    </div>
  );
}
