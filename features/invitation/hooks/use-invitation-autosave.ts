"use client";

import { useEffect } from "react";
import { useInvitationStore } from "../store/invitation-store";
import { saveInvitation } from "../actions/save-invitation";
import { toast } from "sonner";

export function useInvitationAutoSave() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const unsub = useInvitationStore.subscribe(
      (s) => ({
        title: s.title,
        subtitle: s.subtitle,
        date: s.date,
        time: s.time,
        hosts: s.hosts,
        message: s.message,
        venueName: s.venueName,
        venueAddress: s.venueAddress,
        coverImage: s.coverImage,
        tokenId: s.tokenId,
        tokenOverrides: s.tokenOverrides,
        templateSlug: s.templateSlug,
        backgroundType: s.backgroundType,
        dressCode: s.dressCode,
        rsvpDeadline: s.rsvpDeadline,
        rsvpOptions: s.rsvpOptions,
        events: s.events,
        stories: s.stories,
        gallery: s.gallery,
        stickers: s.stickers,
        gifts: s.gifts,
      }),
      (data) => {
        const { setSaveStatus, setLastSaved } = useInvitationStore.getState();
        setSaveStatus("unsaved");
        clearTimeout(timer);
        timer = setTimeout(async () => {
          setSaveStatus("saving");
          try {
            await saveInvitation(data);
            setSaveStatus("saving");
            setLastSaved(new Date());
          } catch {
            setSaveStatus("unsaved");
            toast.error("Auto-save failed - check your connection");
          }
        }, 2500);
      },
    );

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (useInvitationStore.getState().saveStatus === "unsaved") {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unsub();
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
