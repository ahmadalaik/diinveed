// @vitest-environment jsdom
/* eslint-disable @next/next/no-img-element */
import { cleanup, render, screen } from "@testing-library/react";
import React, { type ComponentPropsWithoutRef, type ElementType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { StoriesDikara } from "../dikara-stories";
import { GalleryDikara } from "../dikara-gallery";

type MotionProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  variants?: unknown;
  viewport?: unknown;
  initial?: unknown;
  whileInView?: unknown;
};

vi.mock("motion/react", () => {
  const createMotionComponent = <T extends ElementType>(tag: T) => {
    const MotionComponent = ({
      children,
      variants,
      viewport,
      initial,
      whileInView,
      ...props
    }: MotionProps<T>) =>
      React.createElement(
        tag,
        {
          ...props,
          "data-motion-initial": String(initial),
          "data-motion-while-in-view": String(whileInView),
          "data-motion-variants":
            variants === undefined ? undefined : JSON.stringify(variants),
          "data-motion-viewport":
            viewport === undefined ? undefined : JSON.stringify(viewport),
        },
        children,
      );

    return MotionComponent;
  };

  return {
    motion: {
      div: createMotionComponent("div"),
      p: createMotionComponent("p"),
      h4: createMotionComponent("h4"),
    },
    useInView: () => true,
  };
});

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    ...props
  }: ComponentPropsWithoutRef<"img"> & {
    fill?: boolean;
    quality?: number;
  }) => <img alt={alt} src={String(src)} {...props} />,
}));

const invitation = {
  stories: {
    items: [
      {
        id: "story-1",
        title: "First Meeting",
        year: "2026-01-01",
        body: "We met.",
      },
      {
        id: "story-2",
        title: "Proposal",
        year: "2026-02-01",
        body: "We said yes.",
      },
    ],
  },
  gallery: {
    items: [
      { id: "gallery-1", url: "/gallery-1.jpg" },
      { id: "gallery-2", url: "/gallery-2.jpg" },
    ],
  },
} as InvitationState;

afterEach(() => {
  cleanup();
});

describe("Dikara scroll animation timing", () => {
  it("delays story heading and first card so snap scrolling does not hide the entrance", () => {
    render(<StoriesDikara inv={invitation} />);

    expect(
      screen.getByText("Our Love Story").parentElement?.dataset.motionVariants,
    ).toContain('"delay":0.15');
    expect(
      screen
        .getByText("First Meeting")
        .closest("[data-motion-variants]")
        ?.getAttribute("data-motion-variants"),
    ).toContain('"delay":0.35');
  });

  it("adds an initial delay to the first gallery item", () => {
    const { container } = render(
      <GalleryDikara inv={invitation} openLightbox={() => {}} />,
    );

    const firstGalleryItem = container.querySelector(
      "[data-motion-variants]:has(img)",
    );

    expect(firstGalleryItem?.getAttribute("data-motion-variants")).toContain(
      '"delay":0.25',
    );
  });
});
