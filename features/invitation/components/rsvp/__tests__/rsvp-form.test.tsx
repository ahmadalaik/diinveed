// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/invitation/actions/submit-rsvp", () => ({
  submitRsvp: vi.fn(async () => ({ success: true })),
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
        token="tok-123"
        rsvpOptions={{ accept: "1", maybe: "1", decline: "1", plusOne: "1" }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Full name"), {
      target: { value: "Alice" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit rsvp/i }));

    await waitFor(() => expect(submitRsvpMock).toHaveBeenCalled());

    expect(submitRsvpMock).toHaveBeenCalledWith("tok-123", {
      name: "Alice",
      phoneNumber: "",
      response: "ACCEPT",
      guests: "1",
      hope: "",
    });
  });
});
