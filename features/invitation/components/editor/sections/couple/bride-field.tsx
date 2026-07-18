"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorError,
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../../editor-field";

export function BrideNameField() {
  const brideName = useInvitationStore((s) => s.brideName);
  const errors = useInvitationStore((s) => s.publishErrors?.brideName);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField publishField="brideName" invalid={Boolean(errors?.length)}>
      <EditorLabel htmlFor="brideName">Nama mempelai wanita</EditorLabel>
      <EditorInput
        id="brideName"
        autoComplete="off"
        placeholder="Citra Maharani"
        value={brideName}
        aria-invalid={Boolean(errors?.length)}
        onChange={(e) => set({ brideName: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}

export function BrideNicknameField() {
  const brideNickname = useInvitationStore((s) => s.brideNickname);
  const errors = useInvitationStore((s) => s.publishErrors?.brideNickname);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField publishField="brideNickname" invalid={Boolean(errors?.length)}>
      <EditorLabel htmlFor="brideNickname">
        Nama panggilan mempelai wanita
      </EditorLabel>
      <EditorInput
        id="brideNickname"
        autoComplete="off"
        placeholder="Citra"
        value={brideNickname}
        aria-invalid={Boolean(errors?.length)}
        onChange={(e) => set({ brideNickname: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}

export function BrideDescField() {
  const brideDesc = useInvitationStore((s) => s.brideDescription);
  const errors = useInvitationStore((s) => s.publishErrors?.brideDescription);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField
      publishField="brideDescription"
      invalid={Boolean(errors?.length)}
    >
      <EditorLabel htmlFor="brideDesc">Deskripsi</EditorLabel>
      <EditorTextarea
        id="brideDesc"
        placeholder="Putri kedua dari Bapak Widodo dan Ibu Endang"
        value={brideDesc ?? ""}
        aria-invalid={Boolean(errors?.length)}
        onChange={(e) => set({ brideDescription: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}
