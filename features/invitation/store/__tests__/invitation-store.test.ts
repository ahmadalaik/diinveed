import { describe, it, expect, beforeEach } from "vitest";
import {
  createInvitationStore,
  type InvitationStoreApi,
} from "../invitation-store";

let store: InvitationStoreApi;

beforeEach(() => {
  store = createInvitationStore({
    publishErrors: null,
    brideName: "",
    events: [],
    rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: true },
  });
});

describe("invitation store — instance isolation", () => {
  it("does not share state between store instances", () => {
    const first = createInvitationStore({ title: "Pertama" });
    const second = createInvitationStore({ title: "Kedua" });

    first.getState().set({ title: "Diubah" });

    expect(first.getState().title).toBe("Diubah");
    expect(second.getState().title).toBe("Kedua");
    expect(first.getInitialState().title).toBe("Pertama");
  });
});

describe("invitation store — publishErrors prune-on-edit", () => {
  it("clears a field's error when that field is edited", () => {
    store.getState().setPublishErrors({
      brideName: ["wajib"],
      events: ["wajib"],
    });

    store.getState().set({ brideName: "Citra" });

    expect(store.getState().publishErrors).toEqual({ events: ["wajib"] });
  });

  it("clears array-field errors when the array is edited", () => {
    store.getState().setPublishErrors({ events: ["wajib"] });

    store.getState().set({ events: [{ id: "e1" } as never] });

    expect(store.getState().publishErrors).toBeNull();
  });

  it("becomes null once the last error is pruned", () => {
    store.getState().setPublishErrors({ brideName: ["wajib"] });

    store.getState().set({ brideName: "Citra" });

    expect(store.getState().publishErrors).toBeNull();
  });

  it("leaves errors untouched when an unrelated field is edited", () => {
    store.getState().setPublishErrors({ brideName: ["wajib"] });

    store.getState().set({ groomName: "Deni" });

    expect(store.getState().publishErrors).toEqual({ brideName: ["wajib"] });
  });

  it("is a no-op for prune when there are no errors", () => {
    store.getState().set({ brideName: "Citra" });

    expect(store.getState().publishErrors).toBeNull();
    expect(store.getState().brideName).toBe("Citra");
  });
});

