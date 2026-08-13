import type { InvitationState } from "@/features/invitation/types/invitation.type";
import type { TemplateMode } from "../../types";
import { daysTogether, daysUntilFirstEvent } from "./stats";
import { resolveCountdownEvent } from "@/features/invitation/lib/countdown-event";

export type MixtapeSlideId =
  | "greeting"
  | "days"
  | "couple"
  | "bride"
  | "groom"
  | "stories"
  | "gallery"
  | "quote"
  | "bridge";

export type BuildSlidesOptions = {
  mode: TemplateMode;
  guestName?: string;
  now: Date;
};

/**
 * Menyusun urutan slide fase story.
 *
 * Slide dilewati saat datanya kosong — bukan ditampilkan kosong. Cover tidak
 * termasuk fase story; `couple` dan `bridge` selalu ada, sehingga urutannya
 * tidak pernah nol betapapun kosongnya undangan.
 */
export function buildSlides(
  inv: InvitationState,
  { mode, guestName, now }: BuildSlidesOptions,
): MixtapeSlideId[] {
  const slides: MixtapeSlideId[] = [];

  slides.push("greeting");

  if (inv.quote.trim()) {
    slides.push("quote");
  }

  const hasDaysTogether =
    daysTogether(inv.relationshipStartDate ?? "", now) !== null;
  const countdownEvent = resolveCountdownEvent(
    inv.events,
    inv.countdownEventId,
  );
  const hasCountdown = countdownEvent
    ? daysUntilFirstEvent([countdownEvent], now) !== null
    : false;
  if (hasDaysTogether || hasCountdown) {
    slides.push("days");
  }

  slides.push("couple");

  if (inv.isBrideFirst) {
    slides.push("bride");
    slides.push("groom");
  } else {
    slides.push("groom");
    slides.push("bride");
  }

  if (inv.stories.enabled && inv.stories.items.length > 0) {
    slides.push("stories");
  }

  // if (inv.gallery.enabled && inv.gallery.items.some((item) => item.url)) {
  //   slides.push("gallery");
  // }

  slides.push("bridge");
  return slides;
}
