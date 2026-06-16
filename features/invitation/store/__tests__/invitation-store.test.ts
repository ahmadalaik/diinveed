import { describe, it, expect, beforeEach } from "vitest";
import { useInvitationStore } from "../invitation-store";

const { getState, setState } = useInvitationStore;

beforeEach(() => {
  setState({
    publishErrors: null,
    brideName: "",
    events: [],
    rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: true },
  });
});

describe("invitation store — publishErrors prune-on-edit", () => {
  it("clears a field's error when that field is edited", () => {
    getState().setPublishErrors({
      brideName: ["wajib"],
      events: ["wajib"],
    });

    getState().set({ brideName: "Citra" });

    expect(getState().publishErrors).toEqual({ events: ["wajib"] });
  });

  it("clears array-field errors when the array is edited", () => {
    getState().setPublishErrors({ events: ["wajib"] });

    getState().set({ events: [{ id: "e1" } as never] });

    expect(getState().publishErrors).toBeNull();
  });

  it("becomes null once the last error is pruned", () => {
    getState().setPublishErrors({ brideName: ["wajib"] });

    getState().set({ brideName: "Citra" });

    expect(getState().publishErrors).toBeNull();
  });

  it("leaves errors untouched when an unrelated field is edited", () => {
    getState().setPublishErrors({ brideName: ["wajib"] });

    getState().set({ groomName: "Deni" });

    expect(getState().publishErrors).toEqual({ brideName: ["wajib"] });
  });

  it("is a no-op for prune when there are no errors", () => {
    getState().set({ brideName: "Citra" });

    expect(getState().publishErrors).toBeNull();
    expect(getState().brideName).toBe("Citra");
  });
});
