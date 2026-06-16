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
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { MUSIC_PRESETS } from "@/features/invitation/lib/music-presets";

beforeAll(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(
    async () => {},
  );
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

beforeEach(() => {
  useInvitationStore.setState({ music: "", musicKey: "" });
  uploadMock.mockReset();
  removeMock.mockReset();
});

afterEach(() => cleanup());

describe("MusicField", () => {
  it("selecting a preset stores its url and clears the musicKey", async () => {
    render(<MusicField />);
    const preset = MUSIC_PRESETS[0];

    fireEvent.click(screen.getByText(new RegExp(preset.title)));

    await waitFor(() =>
      expect(useInvitationStore.getState().music).toBe(preset.url),
    );
    expect(useInvitationStore.getState().musicKey).toBe("");
  });

  it("removing an uploaded track calls Cloudinary remove and clears the store", async () => {
    useInvitationStore.setState({
      music: "https://x/up.mp3",
      musicKey: "pid-1",
    });
    render(<MusicField />);

    fireEvent.click(screen.getByLabelText("Hapus musik"));

    await waitFor(() => expect(removeMock).toHaveBeenCalledWith("pid-1"));
    expect(useInvitationStore.getState().music).toBe("");
    expect(useInvitationStore.getState().musicKey).toBe("");
  });

  it("uploading a file stores the returned url and musicKey", async () => {
    uploadMock.mockResolvedValue({
      url: "https://x/new.mp3",
      key: "pid-new",
    });
    render(<MusicField />);

    // The upload pane is forceMount-ed (hidden when inactive), so the file
    // input is always present in the DOM.
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["x"], "song.mp3", { type: "audio/mpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() =>
      expect(useInvitationStore.getState().music).toBe("https://x/new.mp3"),
    );
    expect(uploadMock).toHaveBeenCalledWith(file, {
      kind: "music",
      invitationId: useInvitationStore.getState().id,
    });
    expect(useInvitationStore.getState().musicKey).toBe("pid-new");
  });
});
