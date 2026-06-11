import { TemplateTokenOverrides } from "@/features/template/tokens";

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

export type GiftItem = {
  id: string;
  provider: string;
  accountName: string;
  accountNumber: string;
};

export type InvitationState = {
  id: string;
  userId: string;
  slug: string;
  publicToken: string;

  coverImage: string | null;
  coverImageKey: string | null;
  music: string;
  musicKey: string;
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

  title: string;
  tokenId: string;
  tokenOverrides: TemplateTokenOverrides | null;
  templateSlug: string;
  backgroundType: string;
  rsvpDeadline: string;
  rsvpOptions: RsvpOptions;
  wishesOptions: WishesOptions | null;
  events: EventItem[];
  stories: StoryItem[];
  gallery: Gallery[];
  gifts: GiftItem[];
  isPublished: boolean;
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
