import { toDateTime } from "@/features/invitation/lib/datetime";
import type {
  EventItem,
  Gallery,
  InvitationState,
} from "@/features/invitation/types/invitation.type";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

export type ArtistProfile = {
  role: "Mempelai Wanita" | "Mempelai Pria";
  name: string;
  nickname: string;
  description: string | null;
  image: string | null;
};

export type DiscographyRelease = Gallery & {
  sourceIndex: number;
  title: string;
  subtitle: string;
};

export type GalleryMosaicSlot =
  | "lead"
  | "stack-top"
  | "stack-bottom"
  | "tile"
  | "portrait";

export type GalleryMosaicItem = DiscographyRelease & {
  slot: GalleryMosaicSlot;
};

export type CountdownState =
  | { status: "unavailable" }
  | { status: "completed" }
  | {
      status: "upcoming";
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };

const padTime = (value: number) =>
  Math.max(0, value).toString().padStart(2, "0");

export function getOrderedArtists(
  invitation: InvitationState,
): ArtistProfile[] {
  const bride: ArtistProfile = {
    role: "Mempelai Wanita",
    name: invitation.brideName,
    nickname: invitation.brideNickname,
    description: invitation.brideDescription,
    image: invitation.brideImage,
  };
  const groom: ArtistProfile = {
    role: "Mempelai Pria",
    name: invitation.groomName,
    nickname: invitation.groomNickname,
    description: invitation.groomDescription,
    image: invitation.groomImage,
  };

  return invitation.isBrideFirst ? [bride, groom] : [groom, bride];
}

export function getCoupleNames(invitation: InvitationState): string {
  return getOrderedArtists(invitation)
    .map((artist) => artist.nickname || artist.name)
    .filter(Boolean)
    .join(" & ");
}

export function selectPrimaryEvent(events: EventItem[]): EventItem | null {
  return (
    events
      .map((event) => ({
        event,
        instant: toDateTime(event.date, event.timeStart, event.timezone),
      }))
      .filter(
        (
          entry,
        ): entry is {
          event: EventItem;
          instant: Date;
        } => entry.instant !== null,
      )
      .toSorted(
        (left, right) => left.instant.getTime() - right.instant.getTime(),
      )[0]?.event ?? null
  );
}

export function segmentLyrics(quote: string): string[] {
  return (quote.match(/[^.!?]+[.!?]?/g) ?? [])
    .map((line) => line.trim())
    .filter(Boolean);
}

export function resolveCoverArtwork(
  invitation: InvitationState,
  viewport: "mobile" | "desktop",
): string | null {
  const preferred =
    viewport === "mobile"
      ? invitation.coverMobileImage
      : invitation.coverDesktopImage;
  const alternate =
    viewport === "mobile"
      ? invitation.coverDesktopImage
      : invitation.coverMobileImage;

  return preferred || alternate || invitation.coupleSceneImage || null;
}

export function buildDiscography(
  items: Gallery[],
  events: EventItem[],
): DiscographyRelease[] {
  const eventYear = selectPrimaryEvent(events)?.date.match(/^\d{4}/)?.[0];
  let releaseNumber = 0;

  return items.flatMap((item, sourceIndex) => {
    if (!item.url.trim()) return [];

    releaseNumber += 1;
    return [
      {
        ...item,
        sourceIndex,
        title: `Our Moment ${releaseNumber.toString().padStart(2, "0")}`,
        subtitle: eventYear ? `Photo · ${eventYear}` : "Wedding Release",
      },
    ];
  });
}

export function buildGalleryMosaic(
  items: Gallery[],
  events: EventItem[] = [],
  minimumItems = 0,
): GalleryMosaicItem[] {
  const valid = buildDiscography(items, events);
  if (valid.length === 0) return [];

  const itemCount = Math.max(valid.length, minimumItems);

  return Array.from({ length: itemCount }, (_, index) => {
    const source = valid[index % valid.length];
    if (!source) {
      throw new Error("Gallery mosaic requires at least one valid image");
    }
    let slot: GalleryMosaicSlot;

    if (index === 0) {
      slot = "lead";
    } else if (index === 1) {
      slot = "stack-top";
    } else if (index === 2) {
      slot = "stack-bottom";
    } else {
      slot = "tile";
    }

    const repeated = index >= valid.length;
    return {
      ...source,
      id: repeated ? `${source.id}-repeat-${index}` : source.id,
      key: repeated ? `${source.key}-repeat-${index}` : source.key,
      title: `Our Moment ${(index + 1).toString().padStart(2, "0")}`,
      slot,
    };
  });
}

export function buildOurifyHashtag(bride: string, groom: string): string {
  const compact = `${bride}${groom}`.replace(/[^\p{L}\p{N}]/gu, "");
  return compact ? `#${compact}` : "#Ourify";
}

export function toSafeExternalUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function resolveReviewVideo(configuredUrl: string | null | undefined) {
  const safeConfiguredUrl = toSafeExternalUrl(configuredUrl);

  return safeConfiguredUrl
    ? { ...OURIFY_REVIEW_PLACEHOLDERS.video, url: safeConfiguredUrl }
    : OURIFY_REVIEW_PLACEHOLDERS.video;
}

export function buildCalendarUrl(
  event: EventItem,
  coupleNames: string,
): string | null {
  const start = toDateTime(event.date, event.timeStart, event.timezone);
  if (!start) return null;

  const end =
    toDateTime(event.date, event.timeEnd, event.timezone) ??
    new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const format = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} · ${coupleNames}`,
    details: event.description,
    location: event.locationName,
    dates: `${format(start)}/${format(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getCountdownState(
  target: Date | null,
  now = new Date(),
): CountdownState {
  if (!target || Number.isNaN(target.getTime())) {
    return { status: "unavailable" };
  }

  const distance = target.getTime() - now.getTime();
  if (distance <= 0) return { status: "completed" };

  return {
    status: "upcoming",
    days: padTime(Math.floor(distance / 86_400_000)),
    hours: padTime(Math.floor((distance % 86_400_000) / 3_600_000)),
    minutes: padTime(Math.floor((distance % 3_600_000) / 60_000)),
    seconds: padTime(Math.floor((distance % 60_000) / 1_000)),
  };
}
