"use client";

import { useEffect } from "react";
import { useInvitationStoreApi } from "../store/invitation-store";
import { saveInvitation } from "../actions/save-invitation";
import { toast } from "sonner";
import { shallow } from "zustand/shallow";

export function useInvitationAutoSave() {
  const store = useInvitationStoreApi();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const unsub = store.subscribe(
      (s) => ({
        slug: s.slug,
        title: s.title,
        coverDesktopImage: s.coverDesktopImage,
        coverDesktopImageKey: s.coverDesktopImageKey,
        coverMobileImage: s.coverMobileImage,
        coverMobileImageKey: s.coverMobileImageKey,
        music: s.music,
        musicKey: s.musicKey,
        musicFileName: s.musicFileName,
        quote: s.quote,
        quoteReference: s.quoteReference,
        isBrideFirst: s.isBrideFirst,
        brideName: s.brideName,
        brideNickname: s.brideNickname,
        brideDescription: s.brideDescription,
        brideImage: s.brideImage,
        brideImageKey: s.brideImageKey,
        groomName: s.groomName,
        groomNickname: s.groomNickname,
        groomDescription: s.groomDescription,
        groomImage: s.groomImage,
        groomImageKey: s.groomImageKey,
        coupleSceneImage: s.coupleSceneImage,
        coupleSceneImageKey: s.coupleSceneImageKey,
        livestreamUrl: s.livestreamUrl,
        dressCode: s.dressCode,
        events: s.events,
        stories: s.stories,
        gallery: s.gallery,
        gifts: s.gifts,
        rsvpDeadline: s.rsvpDeadline,
        rsvpOptions: s.rsvpOptions,
        templateSlug: s.templateSlug,
        tokenOverrides: s.tokenOverrides,
        backgroundType: s.backgroundType,
      }),
      (data) => {
        const { setSaveStatus, setLastSaved } = store.getState();
        setSaveStatus("unsaved");
        clearTimeout(timer);
        timer = setTimeout(async () => {
          setSaveStatus("saving");
          try {
            const result = await saveInvitation(data);
            if (result.success) {
              setSaveStatus("saved");
              setLastSaved(new Date());
              store.getState().setHasUnpublishedChanges(true);
            } else {
              setSaveStatus("unsaved");
              toast.error(result.message);
            }
          } catch {
            setSaveStatus("unsaved");
            toast.error("Auto-save failed - check your connection");
          }
        }, 2500);
      },
      { equalityFn: shallow },
    );

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (store.getState().saveStatus === "unsaved") {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unsub();
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [store]);
}
