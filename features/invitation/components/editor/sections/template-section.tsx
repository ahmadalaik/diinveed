"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { TemplateSelectorSection } from "./template-selector-section";

export function TemplateSection() {
  const errors = useInvitationStore((state) => state.publishErrors?.templateSlug);

  return (
    <div
      data-publish-field="templateSlug"
      data-invalid={Boolean(errors?.length) || undefined}
    >
      <TemplateSelectorSection embedded />
    </div>
  );
}
