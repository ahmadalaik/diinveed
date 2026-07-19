import type { RsvpResponse } from "@/generated/prisma/enums";
import type { GuestSummary } from "@/features/guest/types/guest.type";

export type RecentWish = {
  id: string;
  name: string;
  wish: string;
  response: RsvpResponse;
  createdAt: string; // ISO string
};

export type DashboardSummary = {
  hasInvitation: boolean;
  invitation: {
    /** Nickname pasangan dirangkai sesuai isBrideFirst, "" bila belum diisi. */
    coupleName: string;
    isPublished: boolean;
    slug: string;
    /** Tanggal acara terdekat (YYYY-MM-DD) yang akan datang, null bila tak ada. */
    nextEventDate: string | null;
  };
  guests: GuestSummary;
  /** Tamu dengan sentAt terisi (undangan sudah dikirim). */
  sentCount: number;
  wishes: {
    pendingCount: number;
    recent: RecentWish[];
  };
};
