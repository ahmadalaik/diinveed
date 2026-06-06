import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { InvitationState } from "../types/invitation.type";

export type SaveStatus = "saved" | "saving" | "unsaved";

type InvitationStore = InvitationState & {
  set: (patch: Partial<InvitationState>) => void;
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  setSaveStatus: (status: SaveStatus) => void;
  setLastSaved: (data: Date) => void;
};

export const useInvitationStore = create<InvitationStore>()(
  subscribeWithSelector((set) => ({
    id: "",
    userId: "",
    token: "",

    coverImage: null,
    coverImagePublicId: null,
    coverTitle: "",
    coverSubtitle: "",
    music: "",
    musicPublicId: "",
    quote: "",
    quoteReference: "",

    brideName: "",
    brideNickname: "",
    brideDescription: null,
    brideImage: null,
    brideImagePublicId: null,
    groomName: "",
    groomNickname: "",
    groomDescription: null,
    groomImage: null,
    groomImagePublicId: null,

    title: "",
    subtitle: "",
    date: "",
    time: "",
    timezone: "WIB",
    hosts: "",
    message: "",
    tokenId: "aura",
    tokenOverrides: null,
    templateSlug: "kelana",
    backgroundType: "solid",
    dressCode: "",
    rsvpDeadline: "",
    rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: true },
    events: [],
    stories: [],
    gallery: [],
    gifts: [],
    isPublished: false,

    saveStatus: "saved",
    lastSaved: null,

    set: (patch) => set(patch),
    setSaveStatus: (status) => set({ saveStatus: status }),
    setLastSaved: (date) => set({ lastSaved: date }),
  })),
);
