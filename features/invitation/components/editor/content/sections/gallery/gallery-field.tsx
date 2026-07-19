"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EditorField, EditorLabel } from "../../../editor-field";
import { Switch } from "@/components/ui/switch";

export function GalleryEnabledField() {
  const gallery = useInvitationStore((s) => s.gallery);
  const isEnabled = useInvitationStore((s) => s.gallery.enabled);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField className="flex-row">
      <EditorLabel htmlFor="is-story-enabled">Tampilkan Story</EditorLabel>
      <Switch
        id="story-enabled"
        checked={isEnabled}
        onCheckedChange={() =>
          set({ gallery: { ...gallery, enabled: !isEnabled } })
        }
      />
    </EditorField>
  );
}
