"use client";

import { useRef, useState } from "react";
import { InvitationState } from "../types/invitation.type";
import { saveInvitation } from "../actions/save-invitation";

export type SaveStatus = "saved" | "saving" | "unsaved";

export function useInvitationEditor(initialData: InvitationState) {
  const [state, setState] = useState<InvitationState>(initialData);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestStateRef = useRef<InvitationState>(initialData);

  const set = (patch: Partial<InvitationState>) => {
    const next = { ...latestStateRef.current, ...patch };
    latestStateRef.current = next;
    setState(next);
    setSaveStatus("unsaved");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      await saveInvitation(next);
      setSaveStatus("saved");
      setLastSaved(new Date());
    }, 5000);
  };

  return { state, set, saveStatus, lastSaved };
}
