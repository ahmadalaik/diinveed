"use client";

import { useEffect } from "react";
import { InvitationState } from "../../types/invitation.type";
import { useInvitationStore } from "../../store/invitation-store";
import { useInvitationAutoSave } from "../../hooks/use-invitation-autosave";
import { useInvitationEditor } from "../../hooks/use-invitation-editor";
import { Editor } from "./editor";
import { Preview } from "../preview/preview";

type Props = {
  initialData: InvitationState;
};

export function InvitationEditor({ initialData }: Props) {
  useEffect(() => {
    useInvitationStore.setState({ ...initialData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInvitationAutoSave();

  const { cardRef } = useInvitationEditor();

  return (
    <div className="flex h-svh w-full overflow-hidden">
      <Editor onPublish={() => {}} />
      <Preview />
    </div>
  );
}
