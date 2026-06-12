"use client";

import { EditorInitialData } from "../../types/invitation.type";
import { useHydrateInvitationStore } from "../../hooks/use-hydrate-invitation-store";
import { useInvitationAutoSave } from "../../hooks/use-invitation-autosave";
import { Editor } from "./editor";
import { Preview } from "../preview/preview";

type Props = {
  initialData: EditorInitialData;
};

export function InvitationEditor({ initialData }: Props) {
  useHydrateInvitationStore(initialData);
  useInvitationAutoSave();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Editor />
      <Preview />
    </div>
  );
}
