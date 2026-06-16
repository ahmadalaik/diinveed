// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/guest/actions/get-guests-for-send", () => ({
  getGuestsForSend: vi.fn(async () => ({
    guests: [{ id: "g1", name: "Budi", phoneNumber: "0812", slug: "abc" }],
  })),
}));
vi.mock("@/features/guest/actions/mark-guest-sent", () => ({
  markGuestSent: vi.fn(async () => ({ success: true, message: "Ditandai sudah dikirim" })),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { SendInvitationDialog } from "../send/send-invitation-dialog";
import { markGuestSent } from "@/features/guest/actions/mark-guest-sent";

const markSentMock = markGuestSent as ReturnType<typeof vi.fn>;
const openSpy = vi.fn();
vi.stubGlobal("open", openSpy);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const templates = [{ id: "t1", title: "Resmi", body: "Halo {nama} {link}" }];

describe("SendInvitationDialog", () => {
  it("loads recipients, builds a wa.me url, and marks the guest sent", async () => {
    render(
      <SendInvitationDialog
        open
        onOpenChange={() => {}}
        ids={["g1"]}
        templates={templates}
        invitationSlug="citra-7gk2mq8p"
      />,
    );

    // recipient loaded
    await waitFor(() => expect(screen.getByText("Budi")).toBeTruthy());

    // click the per-row send button
    fireEvent.click(screen.getByRole("button", { name: /kirim/i }));

    await waitFor(() => expect(markSentMock).toHaveBeenCalledWith("g1"));
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain("https://wa.me/62812");
    expect(decodeURIComponent(url)).toContain("Halo Budi");
  });
});
