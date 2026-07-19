"use client";

import { useEffect, useState } from "react";
import type { TemplateProps } from "../types";
import { Lightbox } from "./lightbox";
import AgnimayaLayout from "./layout/agnimaya-layout";
import BannerAgnimaya from "./agnimaya-banner";
import { EnvelopeAgnimaya } from "./agnimaya-cover";
import { PrologAgnimaya } from "./agnimaya-prolog";
import { QuoteAgnimaya } from "./agnimaya-quote";
import { CoupleAgnimaya } from "./agnimaya-couple";
import { CountdownAgnimaya } from "./agnimaya-countdown";
import { EventsAgnimaya } from "./agnimaya-events";
import { StoriesAgnimaya } from "./agnimaya-stories";
import { GalleryAgnimaya } from "./agnimaya-gallery";
import { GiftsAgnimaya } from "./agnimaya-gifts";
import { RSVPAgnimaya } from "./agnimaya-rsvp";
import { FooterAgnimaya } from "./agnimaya-footer";
import { MusicPlayer } from "./agnimaya-music-player";
import {
  agnimayaTokens,
  mergeTemplateTokenOverrides,
  templateCssVars,
} from "@/features/template/tokens";
import { LoadingAgnimaya } from "./agnimaya-preloader";

export default function AgnimayaTemplate({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
}: TemplateProps) {
  const isPreview = mode === "preview";
  const [opened, setOpened] = useState(!isPreview);
  const [loading, setLoading] = useState(!isPreview);
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
    <div
      style={templateCssVars(
        mergeTemplateTokenOverrides(agnimayaTokens, invitation.tokenOverrides),
      )}
    >
      {loading && (
        <LoadingAgnimaya inv={invitation} onDone={() => setLoading(false)} />
      )}

      <Lightbox
        lightboxOpen={lightboxOpen}
        closeLightbox={closeLightbox}
        lightboxImg={lightboxImg}
        mode={mode}
      />

      <div className="relative w-full h-dvh overflow-hidden font-(family-name:--tpl-font-body)">
        <div className="hidden lg:block fixed left-0 top-0 w-[70%] h-dvh">
          <BannerAgnimaya inv={invitation} />
        </div>

        {!opened && (
          <EnvelopeAgnimaya
            inv={invitation}
            onOpen={setOpened}
            guestName={guestName}
          />
        )}

        <AgnimayaLayout>
          <MusicPlayer open={opened} autoPlay={mode === "guest"} />

          <PrologAgnimaya inv={invitation} />
          <QuoteAgnimaya inv={invitation} />
          <CoupleAgnimaya inv={invitation} />
          <CountdownAgnimaya inv={invitation} />
          <EventsAgnimaya inv={invitation} />
          {invitation.stories?.enabled && <StoriesAgnimaya inv={invitation} />}
          {invitation.gallery?.enabled && (
            <GalleryAgnimaya inv={invitation} openLightbox={openLightbox} />
          )}
          {invitation.gifts?.enabled && <GiftsAgnimaya inv={invitation} />}
          <RSVPAgnimaya
            publicToken={invitation.publicToken}
            mode={mode}
            guestSlug={guestSlug}
            guestName={guestName}
          />
          <FooterAgnimaya inv={invitation} />
        </AgnimayaLayout>
      </div>
    </div>
  );
}
