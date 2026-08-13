"use client";

import { Heart, Music2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import { getCoupleNames } from "./ourify-data";
import { OurifyArtwork } from "./ourify-image";
import {
  OURIFY_STANDARD_SECTION_CLASS,
  OurifySectionHeading,
} from "./ourify-motion";

function OurifyPlayingIndicator() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const sequences = [
    [5, 14, 8, 12, 5],
    [12, 6, 15, 8, 12],
    [8, 13, 5, 15, 8],
  ];

  return (
    <span
      role="img"
      aria-label="Sedang diputar"
      className="flex h-4 items-end gap-[2px]"
    >
      {sequences.map((sequence, index) => (
        <motion.span
          key={index}
          data-equalizer-bar
          className="w-[2px] origin-bottom bg-(--tpl-text-tertiary)"
          initial={{ height: sequence[0] }}
          animate={shouldReduceMotion ? { height: 10 } : { height: sequence }}
          transition={{
            duration: 0.8 + index * 0.12,
            repeat: shouldReduceMotion ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function OurifyStory({ invitation }: { invitation: InvitationState }) {
  if (!invitation.stories.enabled || invitation.stories.items.length === 0) {
    return null;
  }

  const coupleNames = getCoupleNames(invitation);
  const images = [
    ...invitation.gallery.items.map((item) => item.url),
    invitation.coupleSceneImage,
    invitation.brideImage,
    invitation.groomImage,
  ].filter((value): value is string => Boolean(value?.trim()));

  return (
    <section
      data-ourify-section="story"
      aria-labelledby="ourify-story-title"
      className={OURIFY_STANDARD_SECTION_CLASS}
    >
      <OurifySectionHeading id="ourify-story-title" eyebrow="Our Playlist">
        Love Story
      </OurifySectionHeading>
      <p className="mt-3 text-[12px] text-[#b3b3b3]">
        By {coupleNames} · {invitation.stories.items.length} tracks
      </p>

      <div className="mt-6">
        {invitation.stories.items.map((story, index) => {
          const artwork = images[index % images.length] ?? null;

          return (
            <article key={story.id} className="py-3">
              <div className="flex items-center gap-3">
                <span className="grid w-4 shrink-0 place-items-center text-xs text-[#b3b3b3]">
                  {index === 0 ? <OurifyPlayingIndicator /> : index + 1}
                </span>
                {artwork ? (
                  <OurifyArtwork
                    src={artwork}
                    alt=""
                    fallbackLabel={`Artwork cerita ${story.title}`}
                    sizes="52px"
                    className="size-[52px] shrink-0 rounded-[3px]"
                  />
                ) : (
                  <div className="grid size-[52px] shrink-0 place-items-center rounded-[3px] bg-[#282828]">
                    <Music2
                      aria-hidden="true"
                      className="size-5 text-white/65"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "truncate text-[14px] font-bold",
                      index === 0 ? "text-(--tpl-text-tertiary)" : "text-white",
                    )}
                  >
                    {story.title}
                  </h3>
                  <p className="mt-1 truncate text-[11px] text-[#b3b3b3]">
                    {coupleNames}
                  </p>
                </div>
                <Heart
                  aria-label={`Favoritkan ${story.title}`}
                  fill="currentColor"
                  className="size-[18px] shrink-0 text-(--tpl-text-tertiary)"
                />
              </div>
              <p className="mt-3 ml-7 text-[13px] leading-5 text-[#b3b3b3]">
                {story.body}
              </p>
              {index < invitation.stories.items.length - 1 ? (
                <Separator className="mt-3 ml-7 bg-white/10" />
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
