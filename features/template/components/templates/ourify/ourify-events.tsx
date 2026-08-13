import { CalendarPlus, Clock3, MapPin, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/features/invitation/lib/datetime";
import type {
  EventItem,
  InvitationState,
} from "@/features/invitation/types/invitation.type";
import {
  buildCalendarUrl,
  getCoupleNames,
  toSafeExternalUrl,
} from "./ourify-data";
import {
  OURIFY_STANDARD_SECTION_CLASS,
  OurifySectionHeading,
} from "./ourify-motion";

function OurifyEventCard({
  event,
  coupleNames,
}: {
  event: EventItem;
  coupleNames: string;
}) {
  const mapsUrl = toSafeExternalUrl(event.mapsUrl);
  const calendarUrl = buildCalendarUrl(event, coupleNames);
  const day = formatDate(event.date, "dd") || "--";
  const month = formatDate(event.date, "MMM") || "---";
  const fullDate = formatDate(event.date, "EEEE, d MMMM yyyy");
  const time = [event.timeStart, event.timeEnd, event.timezone]
    .filter(Boolean)
    .join(" - ");

  return (
    <Card
      data-event={event.id}
      role="article"
      className="gap-0 rounded-xl bg-[#181818] p-[18px] text-white shadow-none ring-0"
    >
      <div className="flex gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-lg bg-(--tpl-text-tertiary) text-center text-[#121212]">
          <span className="block text-[18px] leading-none font-black">
            {day}
          </span>
          <span className="-mt-2 block text-[9px] leading-none font-black uppercase">
            {month}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="text-[17px] leading-tight font-extrabold">
            {event.title}
          </h3>
          <p className="mt-1 text-[11px] text-[#b3b3b3]">
            {fullDate || "Tanggal menyusul"}
          </p>
        </div>
      </div>
      {time ? (
        <p className="mt-5 flex items-center gap-2 text-[12px] text-[#d9d9d9]">
          <Clock3 aria-hidden="true" className="size-4 text-[#b3b3b3]" />
          {time}
        </p>
      ) : null}
      {event.locationName ? (
        <p className="mt-3 flex items-start gap-2 text-[12px] text-[#d9d9d9]">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[#b3b3b3]"
          />
          {event.locationName}
        </p>
      ) : null}
      {event.description ? (
        <p className="mt-3 text-[12px] leading-5 text-[#b3b3b3]">
          {event.description}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {mapsUrl ? (
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/55 bg-transparent text-xs text-white hover:bg-white/10 hover:text-white"
          >
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Lihat lokasi ${event.title}`}
            >
              <MapPin data-icon="inline-start" />
              Maps
            </a>
          </Button>
        ) : null}
        {calendarUrl ? (
          <Button
            asChild
            variant="ghost"
            className="rounded-full text-xs text-[#b3b3b3] hover:bg-white/10 hover:text-white"
          >
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Tambahkan ${event.title} ke kalender`}
            >
              <CalendarPlus data-icon="inline-start" />
              Calendar
            </a>
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

export function OurifyEvents({ invitation }: { invitation: InvitationState }) {
  const livestreamUrl = toSafeExternalUrl(invitation.livestreamUrl);
  if (invitation.events.length === 0 && !livestreamUrl) return null;
  const coupleNames = getCoupleNames(invitation);

  return (
    <section
      data-ourify-section="events"
      aria-labelledby="ourify-events-title"
      className={OURIFY_STANDARD_SECTION_CLASS}
    >
      <OurifySectionHeading id="ourify-events-title" eyebrow="On Tour">
        Wedding Events
      </OurifySectionHeading>
      <div className="mt-8 flex flex-col gap-4">
        {invitation.events.map((event) => (
          <OurifyEventCard
            key={event.id}
            event={event}
            coupleNames={coupleNames}
          />
        ))}
        {livestreamUrl ? (
          <Card
            data-event="livestream"
            role="article"
            className="gap-0 rounded-xl bg-[#181818] p-[18px] text-white shadow-none ring-0"
          >
            <div className="flex gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-lg bg-(--tpl-text-tertiary) text-[10px] font-black tracking-[0.08em] text-[#121212]">
                LIVE
              </div>
              <div>
                <h3 className="text-[17px] font-extrabold">Live Streaming</h3>
                <p className="mt-1 text-[11px] text-[#b3b3b3]">
                  Join the celebration from anywhere.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-5 w-full rounded-full border-white/55 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a
                href={livestreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tonton siaran langsung"
              >
                <Radio data-icon="inline-start" />
                Watch Live
              </a>
            </Button>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
