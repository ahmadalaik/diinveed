// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createInvitationStoreWrapper,
  createInvitationTestStore,
} from "../../test-utils/invitation-store-test-utils";
import { usePreviewState } from "../use-preview-state";

afterEach(() => vi.useRealTimers());

describe("usePreviewState", () => {
  it("receives debounced updates from the scoped store instance", () => {
    vi.useFakeTimers();
    const store = createInvitationTestStore({ title: "Awal" });
    const wrapper = createInvitationStoreWrapper(store);
    const { result } = renderHook(() => usePreviewState(400), { wrapper });

    act(() => store.getState().set({ title: "Baru" }));
    expect(result.current.title).toBe("Awal");

    act(() => vi.advanceTimersByTime(400));
    expect(result.current.title).toBe("Baru");
  });

  it("receives immersive template settings", () => {
    vi.useFakeTimers();
    const store = createInvitationTestStore();
    const wrapper = createInvitationStoreWrapper(store);
    const { result } = renderHook(() => usePreviewState(400), { wrapper });

    act(() =>
      store.getState().set({
        coupleSceneImage: "https://cdn.test/couple.webp",
        coupleSceneImageKey: "couple-key",
        livestreamUrl: "https://youtube.com/live/example",
        dressCode: {
          enabled: true,
          description: "Earth tones",
          colors: ["#334433", "#D4AF72"],
        },
      }),
    );
    act(() => vi.advanceTimersByTime(400));

    expect(result.current).toMatchObject({
      coupleSceneImage: "https://cdn.test/couple.webp",
      coupleSceneImageKey: "couple-key",
      livestreamUrl: "https://youtube.com/live/example",
      dressCode: {
        enabled: true,
        description: "Earth tones",
        colors: ["#334433", "#D4AF72"],
      },
    });
  });
});
