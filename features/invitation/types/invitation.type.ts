import { TokenOverrides } from "@/features/template/tokens";

export type RsvpOptions = {
  accept: boolean;
  decline: boolean;
  maybe: boolean;
  plusOne: boolean;
};

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
  publicId: string;
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
  token: string;

  coverImage: string | null;
  coverImagePublicId: string | null;
  coverTitle: string;
  coverSubtitle: string;
  music: string;
  musicPublicId: string;
  quote: string;
  quoteReference: string;

  isBrideFirst: boolean;
  brideName: string;
  brideNickname: string;
  brideDescription: string | null;
  brideImage: string | null;
  brideImagePublicId: string | null;
  groomName: string;
  groomNickname: string;
  groomDescription: string | null;
  groomImage: string | null;
  groomImagePublicId: string | null;

  title: string;
  subtitle: string;
  date: string;
  time: string;
  timezone: string;
  hosts: string;
  message: string;
  tokenId: string;
  tokenOverrides: TokenOverrides | null;
  templateSlug: string;
  backgroundType: string;
  dressCode: string;
  rsvpDeadline: string;
  rsvpOptions: RsvpOptions;
  events: EventItem[];
  stories: StoryItem[];
  gallery: Gallery[];
  gifts: GiftItem[];
  isPublished: boolean;
};

export type GuestRsvpRow = {
  id: string;
  invitationId: string;
  name: string;
  email: string | null;
  response: "ACCEPT" | "DECLINE" | "MAYBE";
  plusOne: boolean;
  submittedAt: Date;
};
