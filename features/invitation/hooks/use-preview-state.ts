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
    token: s.token,
    coverTitle: s.coverTitle,
    coverSubtitle: s.coverSubtitle,
    music: s.music,
    musicPublicId: s.musicPublicId,
    quote: s.quote,
    quoteReference: s.quoteReference,
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
    isPublished: s.isPublished,
  };
}

function selectPreviewFields(s: ReturnType<typeof useInvitationStore.getState>) {
  return {
    coverTitle: s.coverTitle,
    coverSubtitle: s.coverSubtitle,
    music: s.music,
    quote: s.quote,
    quoteReference: s.quoteReference,
    brideName: s.brideName,
    brideNickname: s.brideNickname,
    brideDescription: s.brideDescription,
    brideImage: s.brideImage,
    groomName: s.groomName,
    groomNickname: s.groomNickname,
    groomDescription: s.groomDescription,
    groomImage: s.groomImage,
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
