"use client";

import { useEffect, useState } from "react";
import { EnvelopeKelana } from "./envelope-kelana";
import type { TemplateProps } from "../types";
import { Lightbox } from "./lightbox";
import { KelanaLayout } from "./layout/kelana-layout";
import { BannerKelana } from "./banner-kelana";
import { PrologKelana } from "./prolog-kelana";
import { Quote } from "./quote";
import { CoupleKelana } from "./couple-kelana";
import { CountdownKelana } from "./countdown-kelana";
import { EventsKelana } from "./events-kelana";
import { StoriesKelana } from "./stories-kelana";
import { GalleryKelana } from "./gallery-kelana";
import { GiftsKelana } from "./gifts-kelana";
import { RSVPKelana } from "./rsvp-kelana";
import { FooterKelana } from "./footer-kelana";
import { MusicPlayer } from "./music-player";

export default function KelanaTemplate({
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
      <div className="fixed inset-0 z-40 bg-[url('https://transparenttextures.com/patterns/cream-paper.png')] opacity-60 pointer-events-none mix-blend-multiply" />

      <Lightbox
        lightboxOpen={lightboxOpen}
        closeLightbox={closeLightbox}
        lightboxImg={lightboxImg}
        mode={mode}
      />

      <div className="relative w-full h-screen overflow-hidden font-montserrat">
        <div className="hidden lg:block fixed left-0 top-0 w-[70%] h-screen">
          <BannerKelana inv={invitation} />
        </div>
        {!opened && <EnvelopeKelana inv={invitation} onOpen={setOpened} />}

        <KelanaLayout inv={invitation}>
          <MusicPlayer open={opened} autoPlay={mode === "guest"} />

          <PrologKelana inv={invitation} />
          <Quote inv={invitation} />
          <CoupleKelana inv={invitation} />
          <CountdownKelana inv={invitation} />
          <EventsKelana inv={invitation} />
          <StoriesKelana inv={invitation} />
          <GalleryKelana inv={invitation} openLightbox={openLightbox} />
          <GiftsKelana inv={invitation} />
          <RSVPKelana
            publicToken={invitation.publicToken}
            mode={mode}
            guestSlug={guestSlug}
            guestName={guestName}
          />
          <FooterKelana inv={invitation} />
        </KelanaLayout>
      </div>
    </>
  );
}
