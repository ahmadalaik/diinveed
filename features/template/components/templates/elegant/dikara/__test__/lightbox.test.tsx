// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Lightbox } from "../../shared/lightbox";
import type { Gallery } from "@/features/invitation/types/invitation.type";

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill: _fill,
    onLoad,
    quality: _quality,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    quality?: number;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      {...props}
      onLoad={onLoad}
      data-testid={alt === "Gallery image 1" ? "lightbox-image" : undefined}
    />
  ),
}));

const images = [
  {
    id: "gallery-1",
    url: "https://example.com/gallery-1.jpg",
    key: "gallery-1.jpg",
  },
] satisfies Gallery[];

afterEach(() => {
  cleanup();
});

describe("Lightbox", () => {
  it("closes when the backdrop is clicked", () => {
    const closeLightbox = vi.fn();

    render(
      <Lightbox
        lightboxOpen
        closeLightbox={closeLightbox}
        images={images}
        activeIndex={0}
        setActiveIndex={() => {}}
      />,
    );

    fireEvent.click(screen.getByLabelText("Close gallery preview backdrop"));

    expect(closeLightbox).toHaveBeenCalledTimes(1);
  });

  it("does not close when the image is clicked", () => {
    const closeLightbox = vi.fn();

    render(
      <Lightbox
        lightboxOpen
        closeLightbox={closeLightbox}
        images={images}
        activeIndex={0}
        setActiveIndex={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId("lightbox-image"));

    expect(closeLightbox).not.toHaveBeenCalled();
  });

  it("drags a zoomed image and centers it again when zoom is reset", () => {
    render(
      <Lightbox
        lightboxOpen
        closeLightbox={() => {}}
        images={images}
        activeIndex={0}
        setActiveIndex={() => {}}
      />,
    );

    const imageFrame = screen.getByTestId("lightbox-image").parentElement;
    const viewport = imageFrame?.parentElement;

    expect(imageFrame).not.toBeNull();
    expect(viewport).not.toBeNull();

    Object.defineProperties(imageFrame, {
      offsetWidth: { configurable: true, value: 400 },
      offsetHeight: { configurable: true, value: 300 },
      setPointerCapture: { configurable: true, value: vi.fn() },
      releasePointerCapture: { configurable: true, value: vi.fn() },
      hasPointerCapture: { configurable: true, value: () => true },
    });
    Object.defineProperties(viewport, {
      clientWidth: { configurable: true, value: 400 },
      clientHeight: { configurable: true, value: 300 },
    });

    fireEvent.click(screen.getByLabelText("Zoom in"));
    fireEvent(
      imageFrame!,
      Object.assign(
        new MouseEvent("pointerdown", {
          bubbles: true,
          button: 0,
          clientX: 100,
          clientY: 100,
        }),
        { isPrimary: true, pointerId: 1 },
      ),
    );
    fireEvent(
      imageFrame!,
      Object.assign(
        new MouseEvent("pointermove", {
          bubbles: true,
          clientX: 140,
          clientY: 130,
        }),
        { isPrimary: true, pointerId: 1 },
      ),
    );

    expect(imageFrame?.style.transform).toBe(
      "translate3d(40px, 30px, 0) scale(1.25)",
    );

    fireEvent.click(screen.getByLabelText("Reset zoom"));

    expect(imageFrame?.style.transform).toBe(
      "translate3d(0px, 0px, 0) scale(1)",
    );
  });
});
