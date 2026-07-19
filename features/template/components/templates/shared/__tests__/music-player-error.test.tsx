// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MusicPlayer as AdhikariMusicPlayer } from "../../adhikari/music-player";
import { MusicPlayer as AgnimayaMusicPlayer } from "../../agnimaya/music-player";
import { MusicPlayer as DikaraMusicPlayer } from "../../dikara/dikara-music-player";
import { MusicPlayer as KalandraMusicPlayer } from "../../kalandra/music-player";
import { MusicPlayer as PradiptaMusicPlayer } from "../../pradipta/music-player";
import { MusicPlayer as RenjanaMusicPlayer } from "../../renjana/music-player";

const unavailableSource = "https://x/unavailable.mp3";

const players = [
  {
    name: "Adhikari",
    renderPlayer: () => <AdhikariMusicPlayer open={false} />,
  },
  {
    name: "Agnimaya",
    renderPlayer: () => <AgnimayaMusicPlayer open={false} />,
  },
  {
    name: "Dikara",
    renderPlayer: () => (
      <DikaraMusicPlayer open={false} src={unavailableSource} />
    ),
  },
  {
    name: "Kalandra",
    renderPlayer: () => (
      <KalandraMusicPlayer open={false} src={unavailableSource} />
    ),
  },
  {
    name: "Pradipta",
    renderPlayer: () => (
      <PradiptaMusicPlayer open={false} src={unavailableSource} />
    ),
  },
  {
    name: "Renjana",
    renderPlayer: () => <RenjanaMusicPlayer open={false} />,
  },
];

beforeAll(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(
    async () => {},
  );
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.mocked(HTMLMediaElement.prototype.play).mockResolvedValue(undefined);
});

describe.each(players)("$name music player", ({ renderPlayer }) => {
  it("returns to paused state when the audio source cannot be played", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException(
        "The element has no supported sources.",
        "NotSupportedError",
      ),
    );
    const { getByRole } = render(renderPlayer());
    const button = getByRole("button");

    fireEvent.click(button);

    await waitFor(() =>
      expect(button.className).not.toMatch(/animate-(?:spin|\[spin)/),
    );
  });

  it("returns to paused state when the audio element emits an error", async () => {
    const { container, getByRole } = render(renderPlayer());
    const audio = container.querySelector("audio");
    const button = getByRole("button");

    expect(audio).not.toBeNull();
    fireEvent.play(audio as HTMLAudioElement);
    expect(button.className).toMatch(/animate-(?:spin|\[spin)/);

    fireEvent.error(audio as HTMLAudioElement);

    await waitFor(() =>
      expect(button.className).not.toMatch(/animate-(?:spin|\[spin)/),
    );
  });
});
