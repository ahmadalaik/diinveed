// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { KalandraPreloader } from "../kalandra-preloader";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

const inv = {
  brideNickname: "Ayu",
  groomNickname: "Budi",
  isBrideFirst: true,
  coverImage: null,
} as unknown as InvitationState;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("KalandraPreloader", () => {
  it("renders the couple names while loading", () => {
    render(
      <KalandraPreloader
        inv={inv}
        onDone={() => {}}
        preload={() => new Promise(() => {})}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Ayu & Budi",
    );
  });

  it("respects bride-first order", () => {
    render(
      <KalandraPreloader
        inv={{ ...inv, isBrideFirst: false } as InvitationState}
        onDone={() => {}}
        preload={() => new Promise(() => {})}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Budi & Ayu",
    );
  });

  it("does not call onDone before the 5s minimum, then calls it after the fade", async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(
      <KalandraPreloader
        inv={inv}
        onDone={onDone}
        preload={() => Promise.resolve()}
      />,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(onDone).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4999);
    });
    expect(onDone).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1 + 600);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("forces completion at the 8s max when assets never load", async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(
      <KalandraPreloader
        inv={inv}
        onDone={onDone}
        preload={() => new Promise(() => {})}
      />,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000 + 600);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

