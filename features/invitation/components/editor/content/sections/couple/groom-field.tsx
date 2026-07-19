"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorError,
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../../../editor-field";

export function GroomNameField() {
  const groomName = useInvitationStore((s) => s.groomName);
  const errors = useInvitationStore((s) => s.publishErrors?.groomName);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField publishField="groomName" invalid={Boolean(errors?.length)}>
      <EditorLabel htmlFor="groomName">Nama mempelai pria</EditorLabel>
      <EditorInput
        id="groomName"
        autoComplete="off"
        placeholder="Deni Prasetyo"
        value={groomName}
        aria-invalid={Boolean(errors?.length)}
        onChange={(e) => set({ groomName: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}

export function GroomNicknameField() {
  const groomNickname = useInvitationStore((s) => s.groomNickname);
  const errors = useInvitationStore((s) => s.publishErrors?.groomNickname);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField publishField="groomNickname" invalid={Boolean(errors?.length)}>
      <EditorLabel htmlFor="groomNickname">
        Nama panggilan mempelai pria
      </EditorLabel>
      <EditorInput
        id="groomNickname"
        autoComplete="off"
        placeholder="Deni"
        value={groomNickname}
        aria-invalid={Boolean(errors?.length)}
        onChange={(e) => set({ groomNickname: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}

export function GroomDescField() {
  const groomDesc = useInvitationStore((s) => s.groomDescription);
  const errors = useInvitationStore((s) => s.publishErrors?.groomDescription);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField
      publishField="groomDescription"
      invalid={Boolean(errors?.length)}
    >
      <EditorLabel htmlFor="groomDesc">Deskripsi</EditorLabel>
      <EditorTextarea
        id="groomDesc"
        placeholder="Putra pertama dari Bapak Teguh dan Ibu Sri"
        value={groomDesc ?? ""}
        aria-invalid={Boolean(errors?.length)}
        onChange={(e) => set({ groomDescription: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}
