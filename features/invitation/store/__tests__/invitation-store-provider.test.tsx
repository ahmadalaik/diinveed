// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { Profiler } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { EditorInitialData } from "../../types/invitation.type";
import {
  createInvitationStore,
  DEFAULT_INVITATION_STORE_STATE,
} from "../invitation-store";
import {
  InvitationStoreProvider,
  useInvitationStore,
  useInvitationStoreApi,
} from "../invitation-store-provider";

afterEach(() => cleanup());

function TitleProbe() {
  const title = useInvitationStore((state) => state.title);
  return <span>{title}</span>;
}

describe("InvitationStoreProvider", () => {
  it("reads the provided store state on the first render", () => {
    const store = createInvitationStore({ title: "Undanganku" });

    render(
      <InvitationStoreProvider store={store}>
        <TitleProbe />
      </InvitationStoreProvider>,
    );

    expect(screen.getByText("Undanganku")).toBeTruthy();
  });

  it("renders server HTML from initialData instead of store defaults", () => {
    const initialData: EditorInitialData = {
      ...DEFAULT_INVITATION_STORE_STATE,
      title: "Undanganku",
      liveSlug: "undanganku",
      hasUnpublishedChanges: false,
      updatedAt: new Date("2026-06-28T00:00:00.000Z"),
    };

    const html = renderToString(
      <InvitationStoreProvider initialData={initialData}>
        <TitleProbe />
      </InvitationStoreProvider>,
    );

    expect(html).toContain("Undanganku");
    expect(html).not.toContain("Undangan Tanpa Judul");
  });

  it("hydrates matching initialData without replacing the title", async () => {
    const initialData: EditorInitialData = {
      ...DEFAULT_INVITATION_STORE_STATE,
      title: "Undanganku",
      liveSlug: "undanganku",
      hasUnpublishedChanges: false,
      updatedAt: new Date("2026-06-28T00:00:00.000Z"),
    };
    const ui = (
      <InvitationStoreProvider initialData={initialData}>
        <TitleProbe />
      </InvitationStoreProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(ui);
    document.body.append(container);
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const root = hydrateRoot(container, ui);
    await act(async () => {});

    expect(container.textContent).toBe("Undanganku");
    expect(consoleError).not.toHaveBeenCalled();

    root.unmount();
    consoleError.mockRestore();
    container.remove();
  });

  it("throws outside the provider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<TitleProbe />)).toThrow(
      "InvitationStoreProvider is missing",
    );

    consoleError.mockRestore();
  });

  it("rerenders only consumers whose selected slice changes", () => {
    const store = createInvitationStore({
      title: "Awal",
      music: "lagu.mp3",
    });
    const titleRender = vi.fn();
    const musicRender = vi.fn();

    function SelectedField() {
      const title = useInvitationStore((state) => state.title);
      return <span>{title}</span>;
    }

    function UnchangedField() {
      const music = useInvitationStore((state) => state.music);
      return <span>{music}</span>;
    }

    render(
      <InvitationStoreProvider store={store}>
        <Profiler id="title" onRender={titleRender}>
          <SelectedField />
        </Profiler>
        <Profiler id="music" onRender={musicRender}>
          <UnchangedField />
        </Profiler>
      </InvitationStoreProvider>,
    );

    act(() => store.getState().set({ title: "Baru" }));

    expect(titleRender).toHaveBeenCalledTimes(2);
    expect(musicRender).toHaveBeenCalledTimes(1);
  });

  it("provides a different API for each Provider", () => {
    const first = createInvitationStore({ title: "Satu" });
    const second = createInvitationStore({ title: "Dua" });
    const seen: unknown[] = [];

    function ApiProbe() {
      seen.push(useInvitationStoreApi());
      return null;
    }

    render(
      <>
        <InvitationStoreProvider store={first}>
          <ApiProbe />
        </InvitationStoreProvider>
        <InvitationStoreProvider store={second}>
          <ApiProbe />
        </InvitationStoreProvider>
      </>,
    );

    expect(seen).toEqual([first, second]);
  });
});
