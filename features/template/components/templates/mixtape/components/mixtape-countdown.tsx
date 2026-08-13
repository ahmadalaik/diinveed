"use client";

import { useEffect, useState, useMemo } from "react";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { resolveCountdownEvent } from "@/features/invitation/lib/countdown-event";
import { MixtapeHeading } from "../motifs/heading";
import { Doodle } from "../motifs/doodle";
import { toDateTime } from "@/features/invitation/lib/datetime";

type MixtapeCountdownProps = { inv: InvitationState };

export function MixtapeCountdown({ inv }: MixtapeCountdownProps) {
  const targetEvent = useMemo(() => {
    return (
      resolveCountdownEvent(inv.events, inv.countdownEventId) ??
      inv.events[0] ??
      null
    );
  }, [inv.events, inv.countdownEventId]);

  const targetDate = useMemo(() => {
    if (!targetEvent?.date) return null;
    return new Date(
      `${targetEvent.date}T${targetEvent.timeStart ?? "00:00"}:00`,
    );
  }, [targetEvent]);

  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    isEnded: boolean;
  } | null>(null);

  const createGoogleCalendarUrl = () => {
    if (!targetEvent) return "#";

    const start = toDateTime(
      targetEvent.date,
      targetEvent.timeStart,
      targetEvent.timezone,
    );
    let end = toDateTime(
      targetEvent.date,
      targetEvent.timeEnd,
      targetEvent.timezone,
    );

    if (start && !end) {
      end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default to 2 hours
    }

    const formatForGCal = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const dates =
      start && end ? `${formatForGCal(start)}/${formatForGCal(end)}` : "";

    const coupleName = `${inv.isBrideFirst ? `${inv.brideNickname} & ${inv.groomNickname}` : `${inv.groomNickname} & ${inv.brideNickname}`}`;
    const title = encodeURIComponent(`The Wedding of ${coupleName}`);
    const details = encodeURIComponent(
      `Acara: ${targetEvent.title}\n\n${targetEvent.description || ""}`,
    );
    const location = encodeURIComponent(targetEvent.locationName || "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dates ? `&dates=${dates}` : ""}`;
  };

  useEffect(() => {
    if (!targetDate) return;
    const target = targetDate;

    function calculateTime() {
      const difference = target.getTime() - Date.now();
      if (difference <= 0) {
        return {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          isEnded: true,
        };
      }

      const pad = (n: number) => String(n).padStart(2, "0");
      return {
        days: pad(Math.floor(difference / (1000 * 60 * 60 * 24))),
        hours: pad(Math.floor((difference / (1000 * 60 * 60)) % 24)),
        minutes: pad(Math.floor((difference / 1000 / 60) % 60)),
        seconds: pad(Math.floor((difference / 1000) % 60)),
        isEnded: false,
      };
    }

    const rafId = requestAnimationFrame(() => {
      setTimeLeft(calculateTime());
    });

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(rafId);
    };
  }, [targetDate]);

  if (!targetDate || !timeLeft) return null;

  return (
    <section
      className="relative px-6 py-20 overflow-hidden"
      style={{
        backgroundColor: "var(--tpl-bg-primary)",
        color: "var(--tpl-text-primary)",
      }}
    >
      <Doodle variant="scribble" className="right-[-20%] top-[10%] w-[40%]" />

      <MixtapeHeading
        thin="Menghitung"
        bold="hari bahagia"
        className="text-3xl"
      />

      {timeLeft.isEnded ? (
        <p
          className="mt-6 text-lg font-(family-name:--tpl-font-heading) text-center py-4 rounded-sm border"
          style={{
            borderColor: "var(--tpl-bg-secondary)",
            backgroundColor: "var(--tpl-bg-secondary)",
            color: "var(--tpl-text-secondary)",
            fontWeight: "var(--tpl-weight-heading)",
          }}
        >
          Hari bahagia telah tiba!
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2.5 mt-6 z-10 relative">
          <div
            className="flex flex-col items-center p-3 rounded-sm border"
            style={{
              backgroundColor: "var(--tpl-bg-secondary)",
              borderColor: "var(--tpl-bg-secondary)",
            }}
          >
            <span
              className="text-3xl font-(family-name:--tpl-font-heading) tracking-tight"
              style={{
                color: "var(--tpl-text-tertiary)",
                fontWeight: "var(--tpl-weight-heading)",
              }}
            >
              {timeLeft.days}
            </span>
            <span
              className="text-[10px] uppercase font-(family-name:--tpl-font-body) tracking-wider opacity-85 mt-1"
              style={{ color: "var(--tpl-text-secondary)" }}
            >
              Hari
            </span>
          </div>

          <div
            className="flex flex-col items-center p-3 rounded-sm border"
            style={{
              backgroundColor: "var(--tpl-bg-secondary)",
              borderColor: "var(--tpl-bg-secondary)",
            }}
          >
            <span
              className="text-3xl font-(family-name:--tpl-font-heading) tracking-tight"
              style={{
                color: "var(--tpl-text-tertiary)",
                fontWeight: "var(--tpl-weight-heading)",
              }}
            >
              {timeLeft.hours}
            </span>
            <span
              className="text-[10px] uppercase font-(family-name:--tpl-font-body) tracking-wider opacity-85 mt-1"
              style={{ color: "var(--tpl-text-secondary)" }}
            >
              Jam
            </span>
          </div>

          <div
            className="flex flex-col items-center p-3 rounded-sm border"
            style={{
              backgroundColor: "var(--tpl-bg-secondary)",
              borderColor: "var(--tpl-bg-secondary)",
            }}
          >
            <span
              className="text-3xl font-(family-name:--tpl-font-heading) tracking-tight"
              style={{
                color: "var(--tpl-text-tertiary)",
                fontWeight: "var(--tpl-weight-heading)",
              }}
            >
              {timeLeft.minutes}
            </span>
            <span
              className="text-[10px] uppercase font-(family-name:--tpl-font-body) tracking-wider opacity-85 mt-1"
              style={{ color: "var(--tpl-text-secondary)" }}
            >
              Menit
            </span>
          </div>

          <div
            className="flex flex-col items-center p-3 rounded-sm border"
            style={{
              backgroundColor: "var(--tpl-bg-secondary)",
              borderColor: "var(--tpl-bg-secondary)",
            }}
          >
            <span
              className="text-3xl font-(family-name:--tpl-font-heading) tracking-tight"
              style={{
                color: "var(--tpl-text-tertiary)",
                fontWeight: "var(--tpl-weight-heading)",
              }}
            >
              {timeLeft.seconds}
            </span>
            <span
              className="text-[10px] uppercase font-(family-name:--tpl-font-body) tracking-wider opacity-85 mt-1"
              style={{ color: "var(--tpl-text-secondary)" }}
            >
              Detik
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center z-10 relative">
        <a
          href={createGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-current px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.17em] font-(family-name:--tpl-font-body) hover:bg-(--tpl-text-primary) hover:text-(--tpl-bg-primary) transition-colors duration-200"
        >
          Tambahkan ke Kalender
        </a>
      </div>
    </section>
  );
}
