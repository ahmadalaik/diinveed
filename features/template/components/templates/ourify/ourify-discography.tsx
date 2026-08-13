"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import { Lightbox } from "../shared/lightbox";
import { buildGalleryMosaic, getCoupleNames } from "./ourify-data";
import { OurifyArtwork } from "./ourify-image";
import {
  OURIFY_STANDARD_SECTION_CLASS,
  OurifySectionHeading,
} from "./ourify-motion";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

export function OurifyGallery({ invitation }: { invitation: InvitationState }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const releases = useMemo(
    () =>
      invitation.gallery.enabled
        ? buildGalleryMosaic(invitation.gallery.items, invitation.events, 12)
        : [],
    [invitation.events, invitation.gallery.enabled, invitation.gallery.items],
  );
  const images = useMemo(
    () =>
      releases.map(({ id, key, url }) => ({
        id,
        key,
        url,
      })),
    [releases],
  );
  const closeLightbox = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  if (releases.length === 0) return null;

  return (
    <section
      data-ourify-section="gallery"
      aria-labelledby="ourify-gallery-title"
      className={OURIFY_STANDARD_SECTION_CLASS}
    >
      <OurifySectionHeading id="ourify-gallery-title" eyebrow="Discography">
        Our Gallery
      </OurifySectionHeading>
      <p className="mt-4 text-[13px] leading-5 text-[#b3b3b3]">
        Our favorite moments, kept like a shelf of records.
      </p>

      <div
        className="mt-7 grid grid-cols-3 gap-[10px]"
        style={{
          gridAutoRows: "calc((min(100vw, 480px) - 60px) / 3)",
        }}
      >
        {releases.map((release, index) => (
          <Button
            key={release.id}
            type="button"
            variant="ghost"
            data-mosaic-slot={release.slot}
            aria-label={`Buka ${release.title}`}
            onClick={(event) => {
              lastTriggerRef.current = event.currentTarget;
              setActiveIndex(index);
              setOpen(true);
            }}
            className={cn(
              "relative h-full w-full overflow-hidden rounded-lg p-0",
              release.slot === "lead" && "col-span-2 row-span-2",
            )}
          >
            <OurifyArtwork
              src={release.url}
              alt={`Foto ${release.title}`}
              fallbackLabel={`Artwork ${release.title}`}
              sizes="(max-width: 480px) 66vw, 230px"
              className="h-full w-full rounded-none"
            />
          </Button>
        ))}
      </div>

      <blockquote
        data-testid="ourify-gallery-quote"
        className="mt-10 rounded-xl bg-(--tpl-text-tertiary) px-6 py-8 text-white"
      >
        <p className="text-[24px] leading-[1.22] font-extrabold tracking-[-0.035em]">
          {OURIFY_REVIEW_PLACEHOLDERS.galleryQuote}
        </p>
        <footer className="mt-5 text-[12px] font-bold text-white/80">
          {getCoupleNames(invitation)}
        </footer>
      </blockquote>

      <Lightbox
        lightboxOpen={open}
        closeLightbox={closeLightbox}
        images={images}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </section>
  );
}
