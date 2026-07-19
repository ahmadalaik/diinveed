// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MusicPlayer } from "../music-player";

describe("Shared MusicPlayer component", () => {
  beforeAll(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(
      async () => {},
    );
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders correctly with custom classes and audio element when src is provided", () => {
    const { container } = render(
      <MusicPlayer open={true} autoPlay={true} src="test-song.mp3" />
    );

    const audio = container.querySelector("audio");
    const button = container.querySelector("button");
    expect(audio).not.toBeNull();
    expect(audio?.getAttribute("src")).toBe("test-song.mp3");
    expect(button).not.toBeNull();
  });

  it("returns null if src is not provided", () => {
    const { container } = render(
      <MusicPlayer open={true} autoPlay={true} src="" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("handles user clicks to play and pause the audio", async () => {
    const playSpy = vi.spyOn(HTMLMediaElement.prototype, "play");
    const pauseSpy = vi.spyOn(HTMLMediaElement.prototype, "pause");

    const { getByRole } = render(
      <MusicPlayer open={true} autoPlay={false} src="test-song.mp3" />
    );

    const button = getByRole("button");

    // Initially paused, click should trigger play
    fireEvent.click(button);
    expect(playSpy).toHaveBeenCalled();

    // Mock implementation change state
    // In real browser this is triggered by the "play" event which set isPlaying state
    const audio = document.querySelector("audio") as HTMLAudioElement;
    fireEvent.play(audio);

    // Now playing, click should trigger pause
    fireEvent.click(button);
    expect(pauseSpy).toHaveBeenCalled();
  });

  it("announces whether the control will play or pause music", () => {
    const { getByRole, container } = render(
      <MusicPlayer open={true} autoPlay={false} src="test-song.mp3" />
    );
    const button = getByRole("button", { name: "Putar musik" });
    const audio = container.querySelector("audio");

    fireEvent.play(audio as HTMLAudioElement);
    expect(button.getAttribute("aria-label")).toBe("Jeda musik");
  });
});
