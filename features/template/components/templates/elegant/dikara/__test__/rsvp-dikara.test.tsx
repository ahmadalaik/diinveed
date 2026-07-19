// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import React, { type ComponentPropsWithoutRef, type ElementType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { RSVPDikara } from "../dikara-rsvp";

type MotionProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  animate?: unknown;
  initial?: unknown;
  variants?: unknown;
};

vi.mock("motion/react", () => {
  const createMotionComponent = <T extends ElementType>(tag: T) => {
    const MotionComponent = ({
      children,
      animate,
      initial,
      variants,
      ...props
    }: MotionProps<T>) => React.createElement(tag, props, children);

    return MotionComponent;
  };

  return {
    motion: {
      div: createMotionComponent("div"),
    },
    useInView: () => true,
    useReducedMotion: () => false,
  };
});

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock("@/features/invitation/actions/submit-rsvp", () => ({
  submitRsvp: vi.fn(),
}));

vi.mock("@/features/invitation/actions/get-public-wishes", () => ({
  getPublicWishes: vi.fn().mockResolvedValue({ wishes: [], totalPages: 1 }),
}));

const mockInvitation = {
  coverMobileImage: "/test-bg.jpg",
  wishesOptions: {
    enabled: true,
    showCategory: false,
  },
} as unknown as InvitationState;

afterEach(() => {
  cleanup();
});

describe("RSVPDikara", () => {
  it("renders the RSVP form and title", () => {
    render(
      <RSVPDikara
        publicToken="test-token"
        mode="guest"
        guestSlug="guest-slug"
        guestName="John Doe"
        inv={mockInvitation}
      />,
    );

    expect(screen.getByRole("heading", { name: "R.S.V.P" }).textContent).toBe("R.S.V.P");
    expect(screen.getByLabelText(/Nama/i)).toBeTruthy();
    expect(screen.getByLabelText(/Kehadiran/i)).toBeTruthy();
    expect(screen.getByLabelText(/Wishes & Messages/i)).toBeTruthy();
  });
});
