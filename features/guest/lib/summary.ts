import type { GuestSummary } from "../types/guest.type";

export type GuestSummaryInput = {
  invited: number;
  registeredResponded: number;
  acceptedCount: number;
  maybeCount: number;
  declinedCount: number;
  attendingHeadcount: number;
  unregistered: number;
};

/**
 * Build the summary from DB-aggregated counts. `accepted`/`maybe`/`declined`
 * include unregistered responses (matching the original behaviour); `pending`
 * is registered guests who have not responded.
 */
export function buildGuestSummary(i: GuestSummaryInput): GuestSummary {
  return {
    invited: i.invited,
    accepted: i.acceptedCount,
    maybe: i.maybeCount,
    declined: i.declinedCount,
    pending: i.invited - i.registeredResponded,
    unregistered: i.unregistered,
    attendingHeadcount: i.attendingHeadcount,
  };
}
