"use client";

import { FieldGroup } from "@/components/ui/field";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../editor-field";

function QuoteField() {
  const quote = useInvitationStore((s) => s.quote);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField>
      <EditorLabel htmlFor="quote">Kutipan</EditorLabel>
      <EditorTextarea
        id="quote"
        autoComplete="off"
        placeholder="Tidak ada solusi yang lebih baik bagi dua insan yang saling mencintai dibanding pernikahan."
        value={quote}
        onChange={(e) => set({ quote: e.target.value })}
      />
    </EditorField>
  );
}

function QuoteReferenceField() {
  const quoteReference = useInvitationStore((s) => s.quoteReference);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField>
      <EditorLabel htmlFor="quoteReference">Referensi Kutipan</EditorLabel>
      <EditorInput
        id="quoteReference"
        autoComplete="off"
        placeholder="HR. Ibu Majah"
        value={quoteReference}
        onChange={(e) => set({ quoteReference: e.target.value })}
      />
    </EditorField>
  );
}

export function QuoteSection() {
  return (
    <FieldGroup>
      <QuoteField />
      <QuoteReferenceField />
    </FieldGroup>
  );
}
