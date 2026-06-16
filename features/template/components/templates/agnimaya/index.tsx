"use client";

import { useEffect, useState } from "react";
import type { TemplateProps } from "../types";
import { Lightbox } from "./lightbox";
import AgnimayaLayout from "./layout/agnimaya-layout";
import BannerAgnimaya from "./banner-agnimaya";
import { EnvelopeAgnimaya } from "./envelope-agnimaya";
import { PrologAgnimaya } from "./prolog-agnimaya";
import { QuoteAgnimaya } from "./quote-agnimaya";
import { CoupleAgnimaya } from "./couple-agnimaya";
import { CountdownAgnimaya } from "./countdown-agnimaya";
import { EventsAgnimaya } from "./events-agnimaya";
import { StoriesAgnimaya } from "./stories-agnimaya";
import { GalleryAgnimaya } from "./gallery-agnimaya";
import { GiftsAgnimaya } from "./gifts-agnimaya";
import { RSVPAgnimaya } from "./rsvp-agnimaya";
import { FooterAgnimaya } from "./footer-agnimaya";
import { MusicPlayer } from "./music-player";

export default function AgnimayaTemplate({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
}: TemplateProps) {
  const isPreview = mode === "preview";
  const [opened, setOpened] = useState(isPreview);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const openLightbox = (src: string) => {
    setLightboxImg(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxImg(null), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) closeLightbox();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <>
      <Lightbox
        lightboxOpen={lightboxOpen}
        closeLightbox={closeLightbox}
        lightboxImg={lightboxImg}
        mode={mode}
      />

      <div className="relative w-full h-svh overflow-hidden font-serif">
        <div className="hidden lg:block fixed left-0 top-0 w-[70%] h-svh">
          <BannerAgnimaya inv={invitation} />
        </div>

        {!opened && <EnvelopeAgnimaya inv={invitation} onOpen={setOpened} />}

        <AgnimayaLayout>
          <MusicPlayer open={opened} autoPlay={mode === "guest"} />

          <PrologAgnimaya inv={invitation} />
          <QuoteAgnimaya inv={invitation} />
          <CoupleAgnimaya inv={invitation} />
          <CountdownAgnimaya inv={invitation} />
          <EventsAgnimaya inv={invitation} />
          <StoriesAgnimaya inv={invitation} />
          <GalleryAgnimaya inv={invitation} openLightbox={openLightbox} />
          <GiftsAgnimaya inv={invitation} />
          <RSVPAgnimaya
            publicToken={invitation.publicToken}
            mode={mode}
            guestSlug={guestSlug}
            guestName={guestName}
          />
          <FooterAgnimaya inv={invitation} />
        </AgnimayaLayout>
      </div>
    </>
  );
}
