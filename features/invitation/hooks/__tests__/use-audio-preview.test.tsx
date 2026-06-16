// @vitest-environment jsdom
import { renderHook, act } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { useAudioPreview } from "../use-audio-preview";

beforeAll(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(async () => {});
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

describe("useAudioPreview", () => {
  it("toggles play state for the same url", () => {
    const { result } = renderHook(() => useAudioPreview());
    expect(result.current.isPlaying).toBe(false);

    act(() => result.current.toggle("https://x/a.mp3"));
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentUrl).toBe("https://x/a.mp3");

    act(() => result.current.toggle("https://x/a.mp3"));
    expect(result.current.isPlaying).toBe(false);
  });

  it("switching to a new url keeps playing the new url", () => {
    const { result } = renderHook(() => useAudioPreview());
    act(() => result.current.toggle("https://x/a.mp3"));
    act(() => result.current.toggle("https://x/b.mp3"));
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentUrl).toBe("https://x/b.mp3");
  });

  it("stop() halts playback and clears the current url", () => {
    const { result } = renderHook(() => useAudioPreview());
    act(() => result.current.toggle("https://x/a.mp3"));
    act(() => result.current.stop());
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentUrl).toBe(null);
  });
});
