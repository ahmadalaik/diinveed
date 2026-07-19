"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorField,
  EditorHint,
  EditorInput,
  EditorLabel,
} from "../../../editor-field";

export function LivestreamField() {
  const livestreamUrl = useInvitationStore((state) => state.livestreamUrl);
  const set = useInvitationStore((state) => state.set);

  return (
    <EditorField>
      <EditorLabel htmlFor="livestream-url">URL live streaming</EditorLabel>
      <EditorInput
        id="livestream-url"
        type="url"
        inputMode="url"
        placeholder="https://youtube.com/live/..."
        value={livestreamUrl ?? ""}
        onChange={(event) =>
          set({ livestreamUrl: event.target.value.trim() || null })
        }
      />
      <EditorHint>Opsional dan harus menggunakan HTTPS.</EditorHint>
    </EditorField>
  );
}
