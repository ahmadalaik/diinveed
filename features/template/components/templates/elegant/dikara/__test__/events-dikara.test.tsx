// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import React, { type ComponentPropsWithoutRef, type ElementType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { EventsDikara } from "../dikara-events";

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

const invitation = {
  events: [
    {
      id: "akad",
      date: "2026-07-31",
      timeStart: "07:30",
      timeEnd: "09:00",
      timezone: "WIB",
      title: "Akad Nikah",
      description: "Jl. Cilacap No. 1, Menteng, Jakarta Pusat",
      locationName: "The Hermitage Hotel Jakarta",
      mapsUrl: "https://maps.example.com/hermitage",
    },
  ],
} as InvitationState;

afterEach(() => {
  cleanup();
});

describe("EventsDikara", () => {
  it("separates the date from the time so event metadata stays scannable", () => {
    render(<EventsDikara inv={invitation} />);

    const event = screen.getByRole("article", { name: "Akad Nikah" });

    expect(
      within(event).getByRole("heading", { level: 3, name: "Akad Nikah" }),
    ).toBeTruthy();
    expect(within(event).getByText("31 Juli 2026")).toBeTruthy();
    expect(within(event).getByText("07:30 - 09:00 WIB")).toBeTruthy();
  });

  it("uses a glass card and exposes a clear map action", () => {
    render(<EventsDikara inv={invitation} />);

    const event = screen.getByRole("article", { name: "Akad Nikah" });
    const mapLink = within(event).getByRole("link", {
      name: "Lihat lokasi Akad Nikah",
    });

    expect(event.getAttribute("data-slot")).toBe("card");
    expect(event.className).toContain("backdrop-blur");
    expect(mapLink.getAttribute("href")).toBe(
      "https://maps.example.com/hermitage",
    );
    expect(mapLink.getAttribute("target")).toBe("_blank");
  });

  it("omits optional content without leaving empty actions", () => {
    const eventWithoutOptionals = {
      ...invitation.events[0],
      description: "",
      mapsUrl: "",
    };

    render(
      <EventsDikara inv={{ ...invitation, events: [eventWithoutOptionals] }} />,
    );

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("The Hermitage Hotel Jakarta")).toBeTruthy();
  });
});
