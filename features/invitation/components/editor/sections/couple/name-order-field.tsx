"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EditorField, EditorLabel } from "../../editor-field";
import { Switch } from "@/components/ui/switch";

export function NameOrderField() {
  const isBrideFirst = useInvitationStore((s) => s.isBrideFirst);
  const set = useInvitationStore((s) => s.set);
  
  return (
    <EditorField className="flex-row">
      <EditorLabel htmlFor="is-bride-first">
        Nama Mempelai Wanita Dahulu
      </EditorLabel>
      <Switch
        id="is-bride-first"
        checked={isBrideFirst}
        onCheckedChange={() => set({ isBrideFirst: !isBrideFirst })}
      />
    </EditorField>
  );
}
