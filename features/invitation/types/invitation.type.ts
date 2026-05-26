export type RsvpOptions = {
  accept: boolean;
  decline: boolean;
  maybe: boolean;
  plusOne: boolean;
};

export type EventItem = {
  id: string;
  time: string;
  title: string;
  description: string;
};

export type StoryItem = {
  id: string;
  year: string;
  title: string;
  body: string;
};

export type GiftItem = {
  id: string;
  name: string;
  description: string;
};

export type InvitationState = {
  id: string;
  userId: string;
  token: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  hosts: string;
  message: string;
  venueName: string;
  venueAddress: string;
  coverImage: string | null;
  templateId: string;
  paletteIdx: number | null;
  fontId: string;
  backgroundType: string;
  dressCode: string;
  rsvpDeadline: string;
  rsvpOptions: RsvpOptions;
  events: EventItem[];
  stories: StoryItem[];
  gallery: string[];
  stickers: string[];
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
