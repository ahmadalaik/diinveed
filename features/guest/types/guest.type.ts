import type { RsvpResponse } from "@/generated/prisma/enums";

/** The latest RSVP a guest submitted (null until they respond). */
export type GuestRsvpInfo = {
  response: RsvpResponse;
  guests: number;
  wish: string | null;
  createdAt: Date;
};

/** A listed guest plus their latest RSVP, as shown on the Tamu page. */
export type GuestWithRsvp = {
  id: string;
  slug: string;
  name: string;
  phoneNumber: string | null;
  invitedCount: number;
  category: string | null;
  sentAt: Date | null;
  rsvp: GuestRsvpInfo | null;
};

/** An RSVP not tied to any listed guest (guestId is null). */
export type UnregisteredRsvp = {
  id: string;
  name: string;
  phoneNumber: string | null;
  response: RsvpResponse;
  guests: number;
  wish: string | null;
  createdAt: Date;
};

/** Aggregate counts shown in the summary cards. */
export type GuestSummary = {
  invited: number;
  accepted: number;
  declined: number;
  maybe: number;
  pending: number;
  unregistered: number;
  attendingHeadcount: number;
};

/** Minimal columns needed to build a WhatsApp send link. */
export type GuestSendRow = {
  id: string;
  name: string;
  phoneNumber: string | null;
  slug: string;
};

/** A saved message template (client-safe shape). */
export type MessageTemplate = {
  id: string;
  title: string;
  body: string;
};

/** Status filter keys used by the toolbar and where-builder. */
export type GuestStatusFilter = "hadir" | "menunggu" | "mungkin" | "tidak-hadir" | "unregistered";
