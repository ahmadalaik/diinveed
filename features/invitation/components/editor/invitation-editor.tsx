"use client";

import { EditorInitialData } from "../../types/invitation.type";
import { useInvitationAutoSave } from "../../hooks/use-invitation-autosave";
import { InvitationStoreProvider } from "../../store/invitation-store";
import { InitialThemeDialog } from "./initial-theme-dialog";
import { StudioHeader } from "./header";
import { StudioContent } from "./content";

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
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <StudioHeader />
      <StudioContent />
      <InitialThemeDialog />
    </div>
  );
}
