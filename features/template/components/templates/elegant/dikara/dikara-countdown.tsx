"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { toDateTime } from "@/features/invitation/lib/datetime";
import { resolveCountdownEvent } from "@/features/invitation/lib/countdown-event";
import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  inv: InvitationState;
}

export function DikaraCountdown({ inv }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const mainEvent = resolveCountdownEvent(inv.events, inv.countdownEventId);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const target = toDateTime(
      mainEvent?.date,
      mainEvent?.timeStart,
      mainEvent?.timezone,
    );
    if (!target) {
      return;
    }
    const weddingDate = target.getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0"),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0"),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mainEvent?.date, mainEvent?.timeStart, mainEvent?.timezone]);

  const createGoogleCalendarUrl = () => {
    if (!mainEvent) return "#";

    const start = toDateTime(
      mainEvent.date,
      mainEvent.timeStart,
      mainEvent.timezone,
    );
    let end = toDateTime(mainEvent.date, mainEvent.timeEnd, mainEvent.timezone);

    if (start && !end) {
      end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default to 2 hours
    }

    const formatForGCal = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const dates =
      start && end ? `${formatForGCal(start)}/${formatForGCal(end)}` : "";

    const coupleNme = `${inv.isBrideFirst ? `${inv.brideNickname} & ${inv.groomNickname}` : `${inv.groomNickname} & ${inv.brideNickname}`}`;
    const title = encodeURIComponent(`The Wedding of ${coupleNme}`);
    const details = encodeURIComponent(
      `Acara: ${mainEvent.title}\n\n${mainEvent.description || ""}`,
    );
    const location = encodeURIComponent(mainEvent.locationName || "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dates ? `&dates=${dates}` : ""}`;
  };

  if (!mainEvent && inv.countdownEnded) {
    return <p className="px-8 py-24 text-center">The event has ended</p>;
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh px-8  text-center overflow-hidden snap-start flex flex-col justify-center"
    >
      <div className="absolute inset-0 -z-10 bg-black/15" />
      <div className="relative z-10">
        <motion.p
          className={cn(
            "text-4xl font-medium tracking-wider mb-6",
            "text-(--tpl-text-primary)",
            "font-(family-name:--tpl-font-heading) [text-transform:var(--tpl-transform-heading)]",
          )}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.15)}
        >
          Save the Date
        </motion.p>

        <motion.div
          className={cn("grid grid-cols-4 gap-4", "text-(--tpl-text-primary)")}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.35)}
        >
          <div>
            <span className="text-2xl font-semibold">{timeLeft.days}</span>
            <span className="text-[9px] uppercase text-(--tpl-text-primary)/80 block mt-1">
              Hari
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold">{timeLeft.hours}</span>
            <span className="text-[9px] uppercase text-(--tpl-text-primary)/80 block mt-1">
              Jam
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold">{timeLeft.minutes}</span>
            <span className="text-[9px] uppercase text-(--tpl-text-primary)/80 block mt-1">
              Menit
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold">{timeLeft.seconds}</span>
            <span className="text-[9px] uppercase text-(--tpl-text-primary)/80 block mt-1">
              Detik
            </span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.55)}
          className="mt-10"
        >
          <Button
            asChild
            variant="outline"
            className={cn(
              "bg-transparent border-(--tpl-bg-secondary) text-(--tpl-text-primary)",
              "hover:bg-(--tpl-text-primary)/10 hover:text-(--tpl-text-primary)",
              "text-[10px] tracking-[0.2em] px-8 h-12",
              "[text-transform:var(--tpl-transform-body)]",
            )}
          >
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar strokeWidth={1.5} className="w-4 h-4 mr-2" />
              Add to Calendar
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
