// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createInvitationStoreWrapper,
  createInvitationTestStore,
} from "../../test-utils/invitation-store-test-utils";
import { useInvitationAutoSave } from "../use-invitation-autosave";

const saveInvitationMock = vi.hoisted(() => vi.fn());

vi.mock("../../actions/save-invitation", () => ({
  saveInvitation: saveInvitationMock,
}));

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("useInvitationAutoSave", () => {
  it("saves changes through the scoped store instance", async () => {
    vi.useFakeTimers();
    const store = createInvitationTestStore({ title: "Awal" });
    const wrapper = createInvitationStoreWrapper(store);
    let resolveSave:
      | ((value: { success: boolean; message: string }) => void)
      | null = null;
    saveInvitationMock.mockReturnValue(
      new Promise((resolve) => {
        resolveSave = resolve;
      }),
    );

    renderHook(() => useInvitationAutoSave(), { wrapper });

    act(() => store.getState().set({ title: "Baru" }));
    expect(store.getState().saveStatus).toBe("unsaved");

    act(() => vi.advanceTimersByTime(2500));
    expect(store.getState().saveStatus).toBe("saving");
    expect(saveInvitationMock).toHaveBeenCalledOnce();

    await act(async () => {
      resolveSave?.({ success: true, message: "Perubahan tersimpan" });
      await Promise.resolve();
    });

    expect(store.getState().saveStatus).toBe("saved");
    expect(store.getState().lastSaved).toBeInstanceOf(Date);
    expect(store.getState().hasUnpublishedChanges).toBe(true);
  });

  it("persists immersive template settings", async () => {
    vi.useFakeTimers();
    saveInvitationMock.mockResolvedValue({
      success: true,
      message: "Perubahan tersimpan",
    });
    const store = createInvitationTestStore();
    const wrapper = createInvitationStoreWrapper(store);

    renderHook(() => useInvitationAutoSave(), { wrapper });

    act(() =>
      store.getState().set({
        coupleSceneImage: "https://cdn.test/couple.webp",
        coupleSceneImageKey: "users/u/invitations/i/couple/couple.webp",
        livestreamUrl: "https://youtube.com/live/example",
        dressCode: {
          enabled: true,
          description: "Earth tones",
          colors: ["#334433", "#D4AF72"],
        },
      }),
    );
    await act(async () => vi.advanceTimersByTimeAsync(2500));

    expect(saveInvitationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        coupleSceneImage: "https://cdn.test/couple.webp",
        coupleSceneImageKey: "users/u/invitations/i/couple/couple.webp",
        livestreamUrl: "https://youtube.com/live/example",
        dressCode: {
          enabled: true,
          description: "Earth tones",
          colors: ["#334433", "#D4AF72"],
        },
      }),
    );
  });
});
