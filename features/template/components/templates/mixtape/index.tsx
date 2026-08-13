"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Expand, Minimize, Music, VolumeX, Settings } from "lucide-react";
import {
  mergeTemplateTokenOverrides,
  mixtapeTokens,
  templateCssVars,
} from "@/features/template/tokens";
import type { TemplateProps } from "../types";
import { Lightbox } from "../shared/lightbox";
import { MixtapeStoryControls } from "./components/mixtape-story-controls";
import { MixtapeCountdown } from "./components/mixtape-countdown";
import { StoryShell } from "./components/story-shell";
import { useStoryController } from "./hooks/use-story-controller";
import { buildSlides } from "./lib/slides";
import { Grain } from "./motifs/grain";
import { MixtapeBridge } from "./slides/mixtape-bridge";
import { MixtapeBride } from "./slides/mixtape-bride";
import { MixtapeGroom } from "./slides/mixtape-groom";
import { MixtapeCouple } from "./slides/mixtape-couple";
import { MixtapeCover } from "./slides/mixtape-cover";
import { MixtapeDays } from "./slides/mixtape-days";
import { MixtapeGallery } from "./slides/mixtape-gallery";
import { MixtapeGreeting } from "./slides/mixtape-greeting";
import { MixtapeQuote } from "./slides/mixtape-quote";
import { MixtapeStories } from "./slides/mixtape-stories";
import { MixtapeDressCode } from "./sections/mixtape-dresscode";
import { MixtapeEvents } from "./sections/mixtape-events";
import { MixtapeFooter } from "./sections/mixtape-footer";
import { MixtapeGifts } from "./sections/mixtape-gifts";
import { MixtapeLivestream } from "./sections/mixtape-livestream";
import { MixtapeRsvpWishes } from "./sections/mixtape-rsvp-wishes";
import "./mixtape.css";

/** Slide bernuansa terang; sisanya gelap. */
const LITE_SLIDES = new Set(["couple", "stories"]);

export default function MixtapeTemplate({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
  guest,
  canRsvp = true,
}: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [phase, setPhase] = useState<"story" | "scroll">("story");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [expandedBack, setExpandedBack] = useState(false);

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  useEffect(() => {
    if (!expandedBack) return;
    const timer = setTimeout(() => {
      setExpandedBack(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [expandedBack]);

  const [comparisonMenuOpen, setComparisonMenuOpen] = useState(false);
  const [comparisonExpandedBack, setComparisonExpandedBack] = useState(false);

  useEffect(() => {
    if (!comparisonExpandedBack) return;
    const timer = setTimeout(() => {
      setComparisonExpandedBack(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [comparisonExpandedBack]);

  const cssVars = useMemo(
    () =>
      templateCssVars(
        mergeTemplateTokenOverrides(mixtapeTokens, invitation.tokenOverrides),
      ),
    [invitation.tokenOverrides],
  );

  /**
   * `now` dibekukan sekali saat komponen mount. Fase story baru berjalan
   * setelah tamu menekan segel, sehingga seluruh perhitungan hari terjadi
   * di klien — tidak ada hydration mismatch server↔klien.
   */
  const [now] = useState(() => new Date());

  const slides = useMemo(
    () => buildSlides(invitation, { mode, guestName, now }),
    [invitation, mode, guestName, now],
  );

  const goToScroll = useCallback(() => setPhase("scroll"), []);
  const controller = useStoryController(slides.length, goToScroll);

  const openInvitation = useCallback(() => setOpened(true), []);

  const galleryImages = useMemo(
    () => invitation.gallery.items.filter((item) => item.url),
    [invitation.gallery.items],
  );

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const activeSlide = slides[controller.index] ?? "couple";

  function renderSlide() {
    switch (activeSlide) {
      case "greeting":
        return <MixtapeGreeting guestName={guestName ?? "Guest"} />;
      case "days":
        return <MixtapeDays inv={invitation} now={now} />;
      case "couple":
        return <MixtapeCouple inv={invitation} />;
      case "bride":
        return <MixtapeBride inv={invitation} />;
      case "groom":
        return <MixtapeGroom inv={invitation} />;
      case "stories":
        return <MixtapeStories inv={invitation} />;
      case "gallery":
        return (
          <MixtapeGallery inv={invitation} onOpenLightbox={openLightbox} />
        );
      case "quote":
        return <MixtapeQuote inv={invitation} />;
      case "bridge":
        return <MixtapeBridge onContinue={goToScroll} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-950">
      <div
        className="mixtape-root mx-auto min-h-dvh w-full max-w-md overflow-x-clip bg-(--tpl-bg-primary)"
        style={cssVars}
      >
        <MixtapeStoryControls
          open={opened}
          visible={opened && phase === "story"}
          autoPlay={mode === "guest"}
          src={invitation.music}
          paused={controller.paused}
          onPausedChange={controller.setPaused}
        />

        <Lightbox
          lightboxOpen={lightboxOpen}
          closeLightbox={() => setLightboxOpen(false)}
          images={galleryImages}
          activeIndex={lightboxIndex}
          setActiveIndex={setLightboxIndex}
        />

        {!opened ? (
          <div
            className="relative h-dvh w-full overflow-hidden"
            style={{
              backgroundColor: "var(--tpl-bg-primary)",
              color: "var(--tpl-text-primary)",
            }}
          >
            <MixtapeCover
              inv={invitation}
              guest={guestName}
              onOpen={openInvitation}
            />
            <Grain tone="lite" />
          </div>
        ) : phase === "story" ? (
          <StoryShell
            controller={controller}
            tone={LITE_SLIDES.has(activeSlide) ? "lite" : "dark"}
          >
            {renderSlide()}
          </StoryShell>
        ) : (
          <main>
            <MixtapeCountdown inv={invitation} />
            <MixtapeEvents inv={invitation} />
            <MixtapeGallery inv={invitation} onOpenLightbox={openLightbox} />
            <MixtapeDressCode inv={invitation} />
            <MixtapeLivestream inv={invitation} />
            <MixtapeGifts inv={invitation} />
            {canRsvp || mode === "preview" ? (
              <MixtapeRsvpWishes
                inv={invitation}
                mode={mode}
                guestSlug={guestSlug}
                guestName={guestName}
                sessions={guest?.sessions ?? []}
              />
            ) : null}
            <MixtapeFooter inv={invitation} />
          </main>
        )}

        {opened && phase === "scroll" && (
          <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex flex-col items-end w-full max-w-md -translate-x-1/2 justify-end px-6 gap-2">
            <div
              className={`flex flex-col items-end gap-2 transition-all duration-300 origin-bottom ${
                comparisonMenuOpen
                  ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                  : "opacity-0 translate-y-4 scale-95 pointer-events-none h-0 overflow-hidden"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  controller.setPaused(!controller.paused);
                }}
                className="pointer-events-auto flex size-9 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--tpl-bg-secondary)",
                  color: "var(--tpl-text-secondary)",
                  border: "1px solid var(--tpl-text-secondary)",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                aria-label={controller.paused ? "Putar musik" : "Jeda musik"}
              >
                {controller.paused ? <VolumeX size={16} /> : <Music size={16} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (document.fullscreenElement) {
                    void document.exitFullscreen();
                  } else {
                    void document.documentElement.requestFullscreen?.();
                  }
                }}
                className="pointer-events-auto flex size-9 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--tpl-bg-secondary)",
                  color: "var(--tpl-text-secondary)",
                  border: "1px solid var(--tpl-text-secondary)",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                aria-label={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
              >
                {fullscreen ? <Minimize size={16} /> : <Expand size={16} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!comparisonExpandedBack) {
                    setComparisonExpandedBack(true);
                  } else {
                    setPhase("story");
                    controller.goTo(slides.length - 1);
                    controller.setPaused(false);
                    setComparisonExpandedBack(false);
                    setComparisonMenuOpen(false);
                  }
                }}
                className="pointer-events-auto flex h-9 items-center rounded-full bg-(--tpl-bg-secondary) text-(--tpl-text-secondary) shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out select-none active:scale-95 overflow-hidden"
                style={{
                  border: "1px solid var(--tpl-text-secondary)",
                  width: comparisonExpandedBack ? "185px" : "36px",
                  paddingLeft: comparisonExpandedBack ? "16px" : "10px",
                  paddingRight: comparisonExpandedBack ? "16px" : "10px",
                  justifyContent: comparisonExpandedBack ? "flex-start" : "center",
                  gap: comparisonExpandedBack ? "8px" : "0px",
                }}
              >
                <BookOpen size={16} className="shrink-0" />
                <span
                  className={`text-xs font-(family-name:--tpl-font-body) font-semibold tracking-wider uppercase transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    comparisonExpandedBack ? "opacity-100" : "opacity-0 max-w-0"
                  }`}
                >
                  Kembali ke story
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setComparisonMenuOpen(!comparisonMenuOpen);
                if (comparisonMenuOpen) {
                  setComparisonExpandedBack(false);
                }
              }}
              className="pointer-events-auto flex size-9 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--tpl-bg-secondary)",
                color: "var(--tpl-text-secondary)",
                border: "1px solid var(--tpl-text-secondary)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              aria-label={comparisonMenuOpen ? "Tutup menu" : "Buka menu"}
            >
              <div
                className="transition-transform duration-300"
                style={{
                  transform: comparisonMenuOpen ? "rotate(135deg)" : "rotate(0deg)",
                }}
              >
                <Settings size={18} />
              </div>
            </button>
          </div>
        )}

        {/* {opened && phase === "scroll" && (
          <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex flex-col items-end w-full max-w-md -translate-x-1/2 justify-end px-6 gap-2">
            <button
              type="button"
              onClick={() => {
                controller.setPaused(!controller.paused);
              }}
              className="pointer-events-auto flex size-9 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--tpl-bg-secondary)",
                color: "var(--tpl-text-secondary)",
                border: "1px solid var(--tpl-text-secondary)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              aria-label={controller.paused ? "Putar musik" : "Jeda musik"}
            >
              {controller.paused ? <VolumeX size={16} /> : <Music size={16} />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (document.fullscreenElement) {
                  void document.exitFullscreen();
                } else {
                  void document.documentElement.requestFullscreen?.();
                }
              }}
              className="pointer-events-auto flex size-9 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--tpl-bg-secondary)",
                color: "var(--tpl-text-secondary)",
                border: "1px solid var(--tpl-text-secondary)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              aria-label={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
            >
              {fullscreen ? <Minimize size={16} /> : <Expand size={16} />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!expandedBack) {
                  setExpandedBack(true);
                } else {
                  setPhase("story");
                  controller.goTo(slides.length - 1);
                  controller.setPaused(false);
                  setExpandedBack(false);
                }
              }}
              className="pointer-events-auto flex h-9 items-center rounded-full bg-(--tpl-bg-secondary) text-(--tpl-text-secondary) shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out select-none active:scale-95 overflow-hidden"
              style={{
                border: "1px solid var(--tpl-text-secondary)",
                width: expandedBack ? "180px" : "36px",
                paddingLeft: expandedBack ? "16px" : "10px",
                paddingRight: expandedBack ? "16px" : "10px",
                justifyContent: expandedBack ? "flex-start" : "center",
                gap: expandedBack ? "8px" : "0px",
              }}
            >
              <BookOpen size={16} className="shrink-0" />
              <span
                className={`text-xs font-(family-name:--tpl-font-body) font-semibold tracking-wider uppercase transition-opacity duration-200 whitespace-nowrap ${
                  expandedBack ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                Kembali ke story
              </span>
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}
