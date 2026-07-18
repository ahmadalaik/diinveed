"use client";

import { EditorInitialData } from "../../types/invitation.type";
import { useInvitationAutoSave } from "../../hooks/use-invitation-autosave";
import { InvitationStoreProvider } from "../../store/invitation-store";
import { Editor } from "./editor";
import { LivePreview } from "../live-preview/live-preview";
import { InitialThemeDialog } from "./initial-theme-dialog";

interface Props {
  initialData: EditorInitialData;
}

export function InvitationEditor({ initialData }: Props) {
  return (
    <InvitationStoreProvider initialData={initialData}>
      <InvitationEditorContent />
    </InvitationStoreProvider>
  );
}

function InvitationEditorContent() {
  useInvitationAutoSave();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Editor />
      <LivePreview />
      <InitialThemeDialog />
    </div>
  );
}
