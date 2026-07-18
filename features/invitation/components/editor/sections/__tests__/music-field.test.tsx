// @vitest-environment jsdom
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const uploadMock = vi.fn();
const removeMock = vi.fn(async () => {});

vi.mock("@/hooks/use-r2-upload", () => ({
  useR2Upload: () => ({
    upload: uploadMock,
    remove: removeMock,
    isUploading: false,
    uploadProgress: 0,
  }),
}));

import { MusicField } from "../basic/music-field";
import {
  createInvitationStore,
  InvitationStoreProvider,
} from "@/features/invitation/store/invitation-store";
import { MUSIC_PRESETS } from "@/features/invitation/lib/music-presets";

beforeAll(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(
    async () => {},
  );
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

beforeEach(() => {
  uploadMock.mockReset();
  removeMock.mockReset();
});

afterEach(() => cleanup());

describe("MusicField", () => {
  it("selecting a preset stores its url and clears the musicKey", async () => {
    const store = createInvitationStore({ music: "", musicKey: "" });
    render(
      <InvitationStoreProvider store={store}>
        <MusicField />
      </InvitationStoreProvider>,
    );
    const preset = MUSIC_PRESETS[0];

    fireEvent.click(screen.getByRole("button", { name: "Pilih musik" }));
    fireEvent.click(screen.getByText(new RegExp(preset.title)));

    await waitFor(() => expect(store.getState().music).toBe(preset.url));
    expect(store.getState().musicKey).toBe("");
  });

  it("removing an uploaded track calls Cloudinary remove and clears the store", async () => {
    const store = createInvitationStore({
      music: "https://x/up.mp3",
      musicKey: "pid-1",
    });
    render(
      <InvitationStoreProvider store={store}>
        <MusicField />
      </InvitationStoreProvider>,
    );

    fireEvent.click(screen.getByLabelText("Hapus musik"));

    await waitFor(() => expect(removeMock).toHaveBeenCalledWith("pid-1"));
    expect(store.getState().music).toBe("");
    expect(store.getState().musicKey).toBe("");
  });

  it("uploading a file stores the returned url and musicKey", async () => {
    uploadMock.mockResolvedValue({
      url: "https://x/new.mp3",
      key: "pid-new",
    });
    const store = createInvitationStore({ music: "", musicKey: "" });
    render(
      <InvitationStoreProvider store={store}>
        <MusicField />
      </InvitationStoreProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Pilih musik" }));
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["x"], "song.mp3", { type: "audio/mpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(store.getState().music).toBe("https://x/new.mp3"));
    expect(uploadMock).toHaveBeenCalledWith(file, {
      kind: "music",
      invitationId: store.getState().id,
    });
    expect(store.getState().musicKey).toBe("pid-new");
  });
});
