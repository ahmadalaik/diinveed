"use client";

import { useRef } from "react";
import { ArrowUpRight, CalendarHeart, MapPin } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/features/invitation/lib/datetime";
import type {
  EventItem,
  InvitationState,
} from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";

const fadeUp = (delay: number, reduceMotion: boolean) => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduceMotion ? 0 : 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: reduceMotion ? 0 : delay,
    },
  },
});

function EventCard({
  event,
  delay,
  inView,
  reduceMotion,
}: {
  event: EventItem;
  delay: number;
  inView: boolean;
  reduceMotion: boolean;
}) {
  const titleId = `dikara-event-${event.id}`;
  const time = [
    event.timeStart,
    event.timeEnd ? `- ${event.timeEnd}` : "",
    event.timezone,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp(delay, reduceMotion)}
    >
      <Card
        role="article"
        aria-labelledby={titleId}
        className={cn(
          "gap-0 overflow-hidden border border-white/20 bg-zinc-950/55 py-0 text-(--tpl-text-primary)",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_24px_70px_rgba(9,9,11,0.3)]",
          "backdrop-blur-xl backdrop-saturate-150",
          "[@media(prefers-reduced-transparency:reduce)]:bg-zinc-900/95",
          "[@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none",
        )}
      >
        <CardHeader className="gap-5 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/8 text-(--tpl-text-tertiary)"
            >
              <CalendarHeart className="size-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium tracking-[0.08em] text-(--tpl-text-primary)">
                {formatDate(event.date, "d MMMM yyyy")}
              </p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.14em] text-(--tpl-text-tertiary) uppercase">
                {time}
              </p>
            </div>
          </div>

          <CardTitle>
            <h3
              id={titleId}
              className={cn(
                "text-[2rem] leading-[1.15] font-normal tracking-wide text-(--tpl-text-primary)",
                "font-(family-name:--tpl-font-heading)",
              )}
            >
              {event.title}
            </h3>
          </CardTitle>
        </CardHeader>

        {(event.locationName || event.description) && (
          <CardContent className="px-5 pb-5 sm:px-6">
            <div className="flex items-start gap-3 border-t border-white/12 pt-4">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-(--tpl-text-tertiary)"
                strokeWidth={1.5}
              />
              <div className="min-w-0">
                {event.locationName && (
                  <p className="text-sm leading-relaxed font-medium text-(--tpl-text-primary)">
                    {event.locationName}
                  </p>
                )}
                {event.description && (
                  <CardDescription className="mt-1 text-xs leading-relaxed font-light text-(--tpl-text-primary)/70">
                    {event.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardContent>
        )}

        {event.mapsUrl && (
          <CardFooter className="px-5 pb-5 sm:px-6 sm:pb-6">
            <Button
              asChild
              size="lg"
              variant="outline"
              className={cn(
                "h-11 w-full justify-between border-white/25 bg-white/10 px-4",
                "text-xs font-semibold tracking-[0.12em] text-(--tpl-text-primary) uppercase",
                "hover:border-white/40 hover:bg-white/18 hover:text-(--tpl-text-primary)",
                "motion-reduce:transition-none",
              )}
            >
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Lihat lokasi ${event.title}`}
              >
                Lihat Lokasi
                <ArrowUpRight data-icon="inline-end" strokeWidth={1.5} />
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

interface Props {
  inv: InvitationState;
}

export function DikaraEvents({ inv }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.18 });
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dikara-events-heading"
      className="relative flex min-h-dvh snap-start flex-col overflow-hidden px-5 py-20 sm:px-7"
      style={{ clipPath: "inset(0)" }}
    >
      <div className="absolute inset-0 -z-10 bg-zinc-950/45" />

      <motion.div
        className="mb-7 text-center"
        initial={reduceMotion ? false : "hidden"}
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0.12, reduceMotion)}
      >
        <h2
          id="dikara-events-heading"
          className={cn(
            "text-4xl leading-[1.15] font-normal tracking-wide text-(--tpl-text-primary)",
            "font-(family-name:--tpl-font-heading)",
          )}
        >
          Wedding Event
        </h2>
      </motion.div>

      <div className="flex flex-col gap-5">
        {inv.events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            delay={0.24 + index * 0.12}
            inView={isInView}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </section>
  );
}
