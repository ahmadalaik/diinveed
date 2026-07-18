import { subscribeWithSelector } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import {
  DEFAULT_DRESS_CODE,
  type InvitationState,
} from "../types/invitation.type";

export type SaveStatus = "saved" | "saving" | "unsaved";

/** Per-field publish validation errors, keyed by field name. */
export type PublishFieldErrors = Partial<Record<string, string[]>>;

export type InvitationStoreState = InvitationState & {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  publishErrors: PublishFieldErrors | null;
  liveSlug: string;
  hasUnpublishedChanges: boolean;
};

type InvitationStoreActions = {
  set: (patch: Partial<InvitationState>) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setLastSaved: (date: Date) => void;
  setPublishErrors: (errors: PublishFieldErrors | null) => void;
  setLiveSlug: (value: string) => void;
  setHasUnpublishedChanges: (value: boolean) => void;
};

export type InvitationStore = InvitationStoreState & InvitationStoreActions;

export const DEFAULT_INVITATION_STORE_STATE: InvitationStoreState = {
  id: "",
  userId: "",
  slug: "",
  publicToken: "",
  title: "Undangan Tanpa Judul",
  coverDesktopImage: null,
  coverDesktopImageKey: null,
  coverMobileImage: null,
  coverMobileImageKey: null,
  music: "",
  musicKey: "",
  musicFileName: null,
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
  coupleSceneImage: null,
  coupleSceneImageKey: null,
  livestreamUrl: null,
  dressCode: DEFAULT_DRESS_CODE,
  events: [],
  stories: { enabled: true, items: [] },
  gallery: { enabled: true, items: [] },
  gifts: { enabled: true, transfers: [], packages: [] },
  rsvpDeadline: "",
  rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: true },
  wishesOptions: null,
  tokenOverrides: null,
  templateSlug: "",
  backgroundType: "solid",
  isPublished: false,
  saveStatus: "saved",
  lastSaved: null,
  publishErrors: null,
  liveSlug: "",
  hasUnpublishedChanges: false,
};

export function createInvitationStore(
  initialState: Partial<InvitationStoreState> = {},
) {
  return createStore<InvitationStore>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_INVITATION_STORE_STATE,
      ...initialState,
      set: (patch) =>
        set((state) => {
          const errors = state.publishErrors;
          if (!errors) return patch;

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
      setSaveStatus: (saveStatus) => set({ saveStatus }),
      setLastSaved: (lastSaved) => set({ lastSaved }),
      setPublishErrors: (publishErrors) => set({ publishErrors }),
      setLiveSlug: (liveSlug) => set({ liveSlug }),
      setHasUnpublishedChanges: (hasUnpublishedChanges) =>
        set({ hasUnpublishedChanges }),
    })),
  );
}

export type InvitationStoreApi = ReturnType<typeof createInvitationStore>;
