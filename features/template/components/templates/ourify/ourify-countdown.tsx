"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate, toDateTime } from "@/features/invitation/lib/datetime";
import type { EventItem } from "@/features/invitation/types/invitation.type";
import { resolveCountdownEvent } from "@/features/invitation/lib/countdown-event";
import {
  getCountdownState,
  buildCalendarUrl,
  type CountdownState,
} from "./ourify-data";
import {
  OURIFY_STANDARD_SECTION_CLASS,
  OurifyReveal,
  OurifySectionHeading,
} from "./ourify-motion";

const UNAVAILABLE: CountdownState = { status: "unavailable" };

export function OurifyCountdown({
  events,
  countdownEventId,
  countdownEnded = false,
}: {
  events: EventItem[];
  countdownEventId?: string | null;
  countdownEnded?: boolean;
}) {
  const event = useMemo(
    () => resolveCountdownEvent(events, countdownEventId),
    [events, countdownEventId],
  );
  const target = useMemo(
    () =>
      event ? toDateTime(event.date, event.timeStart, event.timezone) : null,
    [event],
  );
  const [countdown, setCountdown] = useState<CountdownState>(UNAVAILABLE);

  useEffect(() => {
    const update = () => {
      const next = getCountdownState(target);
      setCountdown(next);
      return next.status === "upcoming";
    };

    if (!update()) return;
    const interval = window.setInterval(() => {
      if (!update()) window.clearInterval(interval);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  return (
    <section
      data-ourify-section="countdown"
      data-testid="ourify-countdown"
      aria-labelledby="ourify-countdown-title"
      className={`${OURIFY_STANDARD_SECTION_CLASS} bg-[#181818]`}
    >
      <OurifyReveal>
        <OurifySectionHeading
          id="ourify-countdown-title"
          eyebrow="Dropping Soon"
          className="items-center text-center"
        >
          Counting Down To Forever
        </OurifySectionHeading>
      </OurifyReveal>

      <OurifyReveal className="mt-8">
        {countdown.status === "upcoming" ? (
          <div className="grid grid-cols-4 gap-2">
            {[
              ["DAYS", countdown.days],
              ["HOURS", countdown.hours],
              ["MINUTES", countdown.minutes],
              ["SECONDS", countdown.seconds],
            ].map(([label, value]) => (
              <div
                key={label}
                data-testid="ourify-countdown-cell"
                className="rounded-md bg-[#222222] px-2 py-3 text-center"
              >
                <span className="block text-[22px] leading-none font-black text-(--tpl-text-tertiary) tabular-nums">
                  {value}
                </span>
                <span className="mt-2 block text-[9px] font-bold tracking-[0.08em] text-[#b3b3b3]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md bg-(--tpl-bg-secondary) p-5 text-sm font-semibold text-(--tpl-text-secondary)">
            {countdownEnded || countdown.status === "completed"
              ? "Acara telah berlangsung"
              : "Countdown tidak tersedia"}
          </p>
        )}
      </OurifyReveal>
      {event ? (
        <div className="mt-7 text-center">
          <p className="text-[14px] font-bold">
            {formatDate(event.date, "EEEE, d MMMM yyyy")}
          </p>
          {buildCalendarUrl(event, "Our Wedding") ? (
            <Button
              asChild
              className="mt-4 rounded-full border-transparent bg-(--tpl-text-tertiary) px-6 text-[11px] font-extrabold tracking-[0.08em] text-[#121212] hover:bg-(--tpl-text-tertiary)/90 hover:text-[#121212]"
            >
              <a
                href={buildCalendarUrl(event, "Our Wedding") ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                SAVE THE DATE
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
