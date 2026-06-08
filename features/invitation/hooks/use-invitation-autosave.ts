"use client";

import { useEffect } from "react";
import { useInvitationStore } from "../store/invitation-store";
import { saveInvitation } from "../actions/save-invitation";
import { toast } from "sonner";
import { shallow } from "zustand/shallow";

export function useInvitationAutoSave() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const unsub = useInvitationStore.subscribe(
      (s) => ({
        coverImage: s.coverImage,
        coverImagePublicId: s.coverImagePublicId,
        coverTitle: s.coverTitle,
        coverSubtitle: s.coverSubtitle,
        music: s.music,
        musicPublicId: s.musicPublicId,
        quote: s.quote,
        quoteReference: s.quoteReference,
        isBrideFirst: s.isBrideFirst,
        brideName: s.brideName,
        brideNickname: s.brideNickname,
        brideDescription: s.brideDescription,
        brideImage: s.brideImage,
        brideImagePublicId: s.brideImagePublicId,
        groomName: s.groomName,
        groomNickname: s.groomNickname,
        groomDescription: s.groomDescription,
        groomImage: s.groomImage,
        groomImagePublicId: s.groomImagePublicId,
        slug: s.slug,
        title: s.title,
        subtitle: s.subtitle,
        date: s.date,
        time: s.time,
        timezone: s.timezone,
        hosts: s.hosts,
        message: s.message,
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
            setSaveStatus("saved");
            setLastSaved(new Date());
          } catch {
            setSaveStatus("unsaved");
            toast.error("Auto-save failed - check your connection");
          }
        }, 2500);
      },
      { equalityFn: shallow },
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
