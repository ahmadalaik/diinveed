// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/invitation/actions/submit-rsvp", () => ({
  submitRsvp: vi.fn(async () => ({
    success: true,
    message: "Terima kasih, konfirmasi Anda terkirim",
  })),
}));

import { RsvpForm } from "../rsvp-form";
import { submitRsvp } from "@/features/invitation/actions/submit-rsvp";

const submitRsvpMock = submitRsvp as ReturnType<typeof vi.fn>;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("RsvpForm", () => {
  it("submits the payload shape expected by the RSVP schema", async () => {
    render(
      <RsvpForm
        publicToken="tok-123"
        rsvpOptions={{ accept: "1", maybe: "1", decline: "1", plusOne: "1" }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Full name"), {
      target: { value: "Alice" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit rsvp/i }));

    await waitFor(() => expect(submitRsvpMock).toHaveBeenCalled());

    expect(submitRsvpMock).toHaveBeenCalledWith(
      "tok-123",
      {
        name: "Alice",
        phoneNumber: "",
        response: "ACCEPT",
        guests: "1",
        wish: "",
      },
      undefined,
    );
  });

  it("prefills the guest name and forwards guestSlug to submitRsvp", async () => {
    render(
      <RsvpForm
        publicToken="tok-123"
        guestSlug="guest-abc"
        guestName="Budi"
        rsvpOptions={{ accept: "1", maybe: "1", decline: "1", plusOne: "1" }}
      />,
    );

    expect((screen.getByPlaceholderText("Full name") as HTMLInputElement).value).toBe("Budi");

    fireEvent.click(screen.getByRole("button", { name: /submit rsvp/i }));
    await waitFor(() => expect(submitRsvpMock).toHaveBeenCalled());

    expect(submitRsvpMock).toHaveBeenCalledWith(
      "tok-123",
      expect.objectContaining({ name: "Budi" }),
      "guest-abc",
    );
  });
});
