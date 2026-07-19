"use client";

import { FieldGroup } from "@/components/ui/field";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { slugifyName } from "@/features/invitation/lib/slug";
import {
  EditorError,
  EditorField,
  EditorLabel,
  EditorInput,
} from "../../editor-field";

export function InvitationUrlSection() {
  const slug = useInvitationStore((s) => s.slug);
  const errors = useInvitationStore((s) => s.publishErrors?.slug);
  const set = useInvitationStore((s) => s.set);

  return (
    <FieldGroup className="gap-3">
      <EditorField publishField="slug" invalid={Boolean(errors?.length)}>
        <EditorLabel htmlFor="invitation-url">
          URL Undangan (Opsional)
        </EditorLabel>
        <ButtonGroup className="w-full items-stretch">
          <ButtonGroupText className="border-transparent pl-2.5 pr-0! font-normal text-muted-foreground text-[13px] md:text-sm bg-muted/60 shadow-none">
            https://diinveed.com/i/
          </ButtonGroupText>
          <EditorInput
            id="invitation-url"
            value={slug}
            aria-invalid={Boolean(errors?.length)}
            onChange={(e) => set({ slug: slugifyName(e.target.value) })}
            placeholder="citra-rama"
            className="w-full [&#invitation-url]:rounded-r-md!"
          />
        </ButtonGroup>
        <EditorError errors={errors} />
      </EditorField>
    </FieldGroup>
  );
}
