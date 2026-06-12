"use client";

import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useInvitationStore } from "../store/invitation-store";
import { InvitationState } from "../types/invitation.type";

function getPreviewSnapshot(): InvitationState {
  const s = useInvitationStore.getState();
  return {
    id: s.id,
    userId: s.userId,
    slug: s.slug,
    publicToken: s.publicToken,
    coverImage: s.coverImage,
    coverImageKey: s.coverImageKey,
    music: s.music,
    musicKey: s.musicKey,
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
    title: s.title,
    tokenId: s.tokenId,
    tokenOverrides: s.tokenOverrides,
    templateSlug: s.templateSlug,
    backgroundType: s.backgroundType,
    rsvpDeadline: s.rsvpDeadline,
    rsvpOptions: s.rsvpOptions,
    wishesOptions: s.wishesOptions,
    events: s.events,
    stories: s.stories,
    gallery: s.gallery,
    gifts: s.gifts,
    isPublished: s.isPublished,
  };
}

function selectPreviewFields(
  s: ReturnType<typeof useInvitationStore.getState>,
) {
  return {
    coverImage: s.coverImage,
    coverImageKey: s.coverImageKey,
    music: s.music,
    quote: s.quote,
    quoteReference: s.quoteReference,
    isBrideFirst: s.isBrideFirst,
    brideName: s.brideName,
    brideNickname: s.brideNickname,
    brideDescription: s.brideDescription,
    brideImage: s.brideImage,
    groomName: s.groomName,
    groomNickname: s.groomNickname,
    groomDescription: s.groomDescription,
    groomImage: s.groomImage,
    title: s.title,
    tokenId: s.tokenId,
    tokenOverrides: s.tokenOverrides,
    templateSlug: s.templateSlug,
    backgroundType: s.backgroundType,
    rsvpDeadline: s.rsvpDeadline,
    rsvpOptions: s.rsvpOptions,
    events: s.events,
    stories: s.stories,
    gallery: s.gallery,
    gifts: s.gifts,
  };
}

export function usePreviewState(debounceMs = 400): InvitationState {
  const [snapshot, setSnapshot] = useState<InvitationState>(getPreviewSnapshot);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const unsub = useInvitationStore.subscribe(
      selectPreviewFields,
      () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setSnapshot(getPreviewSnapshot());
        }, debounceMs);
      },
      { equalityFn: shallow },
    );

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [debounceMs]);

  return snapshot;
}
