import { TemplateTokenOverrides } from "@/features/template/tokens";
import type { EditorEventItem } from "../events/session.types";

export type RsvpOptions = {
  accept: boolean;
  decline: boolean;
  maybe: boolean;
  plusOne: boolean;
};

export type WishesOptions = {
  enabled: boolean;
  reviewMode: boolean;
  allowPublic: boolean;
  showCategory: boolean;
};

export type DressCode = {
  enabled: boolean;
  description: string;
  colors: string[];
};

export const DEFAULT_DRESS_CODE: DressCode = {
  enabled: false,
  description: "",
  colors: [],
};

export type WishModerationStatus = "PENDING" | "APPROVED" | "HIDDEN";

export type EventItem = {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  timezone: string;
  title: string;
  description: string;
  locationName: string;
  mapsUrl: string;
};

export type StoryItem = {
  id: string;
  year: string;
  title: string;
  body: string;
};

export type Gallery = {
  id: string;
  url: string;
  key: string;
};

export type GiftTransfer = {
  id: string;
  provider: string;
  accountName: string;
  accountNumber: string;
};

export type GiftPackage = {
  id: string;
  recipientName: string;
  recipientPhoneNumber: string;
  address: string;
};

export type InvitationState = {
  id: string;
  userId: string;
  slug: string;
  publicToken: string;

  title: string;
  coverDesktopImage: string | null;
  coverDesktopImageKey: string | null;
  coverMobileImage: string | null;
  coverMobileImageKey: string | null;
  music: string;
  musicKey: string;
  musicFileName: string | null;

  quote: string;
  quoteReference: string;

  isBrideFirst: boolean;
  brideName: string;
  brideNickname: string;
  brideDescription: string | null;
  brideImage: string | null;
  brideImageKey: string | null;
  groomName: string;
  groomNickname: string;
  groomDescription: string | null;
  groomImage: string | null;
  groomImageKey: string | null;

  relationshipStartDate?: string;

  coupleSceneImage: string | null;
  coupleSceneImageKey: string | null;
  livestreamUrl: string | null;
  dressCode: DressCode;

  events: EventItem[];
  stories: { enabled: boolean; items: StoryItem[] };
  gallery: { enabled: boolean; items: Gallery[] };
  gifts: {
    enabled: boolean;
    transfers: GiftTransfer[];
    packages: GiftPackage[];
  };

  rsvpDeadline: string;
  rsvpOptions: RsvpOptions;
  wishesOptions: WishesOptions | null;

  tokenOverrides: TemplateTokenOverrides | null;
  templateSlug: string;
  backgroundType: string;

  isPublished: boolean;
  countdownEventId?: string | null;
  countdownEnded?: boolean;
};

export type PublicWish = {
  id: string;
  name: string;
  wish: string;
  category: string | null;
  createdAt: Date;
};

export type WishRow = {
  id: string;
  name: string;
  wish: string;
  response: "ACCEPT" | "DECLINE" | "MAYBE";
  guests: number;
  category: string | null;
  moderationStatus: WishModerationStatus;
  createdAt: Date;
};

/** Shape returned to the editor: full state + live/publish metadata. */
export type EditorInitialData = Omit<InvitationState, "events"> & {
  /** Relational draft sessions plus editor-only lifecycle metadata. */
  events: EditorEventItem[];
  /** Slug currently live to the public (Invitation.slug). May differ from the draft slug. */
  liveSlug: string;
  /** True when the draft has edits not yet published. */
  hasUnpublishedChanges: boolean;
  /** Last updated time for auto-save status. */
  updatedAt: Date | null;
};
