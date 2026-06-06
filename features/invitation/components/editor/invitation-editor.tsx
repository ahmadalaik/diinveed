"use client";

import { InvitationState } from "../../types/invitation.type";
import { useHydrateInvitationStore } from "../../hooks/use-hydrate-invitation-store";
import { useInvitationAutoSave } from "../../hooks/use-invitation-autosave";
import { Editor } from "./editor";
import { Preview } from "../preview/preview";

type Props = {
  initialData: InvitationState;
};

export function InvitationEditor({ initialData }: Props) {
  useHydrateInvitationStore(initialData);

  useInvitationAutoSave();

  // const { cardRef } = useInvitationEditor();

  return (
    <div className="flex h-svh w-full overflow-hidden">
      <Editor onPublish={() => {}} />
      <Preview />
    </div>
  );
}
