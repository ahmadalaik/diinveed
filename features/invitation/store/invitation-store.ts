import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { InvitationState } from "../types/invitation.type";

export type SaveStatus = "saved" | "saving" | "unsaved";

/** Per-field publish validation errors, keyed by field name. */
export type PublishFieldErrors = Partial<Record<string, string[]>>;

type InvitationStore = InvitationState & {
  set: (patch: Partial<InvitationState>) => void;
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  setSaveStatus: (status: SaveStatus) => void;
  setLastSaved: (data: Date) => void;
  publishErrors: PublishFieldErrors | null;
  setPublishErrors: (errors: PublishFieldErrors | null) => void;
};

export const useInvitationStore = create<InvitationStore>()(
  subscribeWithSelector((set) => ({
    id: "",
    userId: "",
    slug: "",
    publicToken: "",

    coverImage: null,
    coverImageKey: null,
    music: "",
    musicKey: "",
    quote: "",
    quoteReference: "",

    isBrideFirst: true,
    brideName: "",
    brideNickname: "",
    brideDescription: null,
    brideImage: null,
    brideImageKey: null,
    groomName: "",
    groomNickname: "",
    groomDescription: null,
    groomImage: null,
    groomImageKey: null,

    title: "",
    tokenId: "aura",
    tokenOverrides: null,
    templateSlug: "kelana",
    backgroundType: "solid",
    rsvpDeadline: "",
    rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: true },
    wishesOptions: null,
    events: [],
    stories: [],
    gallery: [],
    gifts: [],
    isPublished: false,

    saveStatus: "saved",
    lastSaved: null,
    publishErrors: null,

    set: (patch) =>
      set((state) => {
        const errors = state.publishErrors;
        if (!errors) return patch;
        // Clear the publish error for any field touched by this edit.
        const next = { ...errors };
        let changed = false;
        for (const key of Object.keys(patch)) {
          if (key in next) {
            delete next[key];
            changed = true;
          }
        }
        if (!changed) return patch;
        return {
          ...patch,
          publishErrors: Object.keys(next).length > 0 ? next : null,
        };
      }),
    setSaveStatus: (status) => set({ saveStatus: status }),
    setLastSaved: (date) => set({ lastSaved: date }),
    setPublishErrors: (errors) => set({ publishErrors: errors }),
  })),
);
