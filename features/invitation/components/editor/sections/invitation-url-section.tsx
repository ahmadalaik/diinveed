"use client";

import { FieldGroup } from "@/components/ui/field";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { slugifyName } from "@/features/invitation/lib/slug";
import { EditorField, EditorInput, EditorLabel } from "../editor-field";

export function InvitationUrlSection() {
  const slug = useInvitationStore((s) => s.slug);
  const publicToken = useInvitationStore((s) => s.publicToken);
  const set = useInvitationStore((s) => s.set);

  return (
    <FieldGroup className="gap-3">
      <EditorField>
        <EditorLabel htmlFor="invitation-url">URL Undangan</EditorLabel>
        <EditorInput
          id="invitation-url"
          value={slug}
          onChange={(e) => set({ slug: slugifyName(e.target.value) })}
          placeholder="citra-dan-rama"
        />
        <p className="text-[11px] text-muted-foreground">
          diinveed.com/invitation/{slug || "nama"}-{publicToken || "xxxx"}
        </p>
      </EditorField>
    </FieldGroup>
  );
}
