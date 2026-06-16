import { describe, it, expect } from "vitest";
import { buildGuestSummary } from "../summary";

describe("buildGuestSummary", () => {
  it("computes pending as invited minus registered responders and keeps response totals", () => {
    const summary = buildGuestSummary({
      invited: 10,
      registeredResponded: 6,
      acceptedCount: 5,
      maybeCount: 2,
      declinedCount: 1,
      attendingHeadcount: 12,
      unregistered: 2,
    });
    expect(summary).toEqual({
      invited: 10,
      accepted: 5,
      maybe: 2,
      declined: 1,
      pending: 4,
      unregistered: 2,
      attendingHeadcount: 12,
    });
  });
});
