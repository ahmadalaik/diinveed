import type { GuestWithRsvp } from "../types/guest.type";

export type GuestStatusKey =
  | "pending-unsent"
  | "pending-sent"
  | "accepted"
  | "declined"
  | "maybe";

export type GuestStatus = { key: GuestStatusKey; label: string };

export function guestStatus(guest: GuestWithRsvp): GuestStatus {
  if (!guest.rsvp) {
    return guest.sentAt
      ? { key: "pending-sent", label: "Terkirim" }
      : { key: "pending-unsent", label: "Belum dikirim" };
  }
  switch (guest.rsvp.response) {
    case "ACCEPT":
      return { key: "accepted", label: "Hadir" };
    case "DECLINE":
      return { key: "declined", label: "Tidak hadir" };
    default:
      return { key: "maybe", label: "Mungkin" };
  }
}
