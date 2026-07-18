"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorError,
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../../editor-field";

export function QuoteField() {
  const quote = useInvitationStore((s) => s.quote);
  const errors = useInvitationStore((s) => s.publishErrors?.quote);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField publishField="quote" invalid={Boolean(errors?.length)}>
      <EditorLabel htmlFor="quote">Kutipan</EditorLabel>
      <EditorTextarea
        id="quote"
        autoComplete="off"
        placeholder="Tidak ada solusi yang lebih baik bagi dua insan yang saling mencintai dibanding pernikahan."
        value={quote}
        aria-invalid={Boolean(errors?.length)}
        onChange={(e) => set({ quote: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}

export function QuoteReferenceField() {
  const quoteReference = useInvitationStore((s) => s.quoteReference);
  const errors = useInvitationStore((s) => s.publishErrors?.quoteReference);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField
      publishField="quoteReference"
      invalid={Boolean(errors?.length)}
    >
      <EditorLabel htmlFor="quoteReference">Referensi</EditorLabel>
      <EditorInput
        id="quoteReference"
        autoComplete="off"
        placeholder="HR. Ibu Majah"
        value={quoteReference}
        aria-invalid={Boolean(errors?.length)}
        onChange={(e) => set({ quoteReference: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}
