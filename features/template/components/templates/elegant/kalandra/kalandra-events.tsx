"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { formatDate } from "@/features/invitation/lib/datetime";
import { ArrowUpRight, CalendarHeart } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay,
    },
  },
});

interface EventCardProps {
  delay: number;
  children: React.ReactNode;
}

function EventCard({ delay, children }: EventCardProps) {
  return (
    <motion.div
      className="relative p-7"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-150px" }}
      variants={fadeUp(delay)}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  inv: InvitationState;
}

export function KalandraEvents({ inv }: Props) {
  return (
    <section className="px-8 py-16 bg-(--tpl-bg-primary)">
      <motion.div
        className="text-center mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp(0)}
      >
        <h2
          className={cn(
            "font-medium text-4xl tracking-wider",
            "font-(family-name:--tpl-font-heading) text-(--tpl-text-secondary)",
          )}
        >
          Wedding Event
        </h2>
      </motion.div>

      <div className="space-y-8">
        {inv.events.map((event, index) => (
          <EventCard key={event.id} delay={index * 0.15}>
            <div
              className={cn(
                "absolute top-8 right-8",
                "text-(--tpl-text-secondary)",
              )}
            >
              <CalendarHeart strokeWidth={1.5} />
            </div>
            <span
              className={cn(
                "inline-block py-1 text-xs tracking-[0.2em] font-semibold mb-4 border-b border-(--tpl-text-secondary)",
                "text-(--tpl-text-secondary) [text-transform:var(--tpl-transform-heading)]",
              )}
            >
              {formatDate(event.date, "PPP")}
            </span>
            <div className={cn("tracking-wide", "text-(--tpl-text-secondary)")}>
              <h3
                className={cn(
                  "text-3xl font-medium tracking-wider",
                  "font-(family-name:--tpl-font-heading)",
                )}
              >
                {event.title}
              </h3>
              <p
                className={cn(
                  "text-sm font-semibold my-2",
                  "font-(family-name:--tpl-font-body)",
                )}
              >
                {event.timeStart}
                {event.timeEnd && ` - ${event.timeEnd}`}
                {event.timezone && ` ${event.timezone}`}
              </p>
              <p className="text-sm font-light leading-relaxed mb-2">
                {event.locationName}
              </p>
              <p
                className={cn(
                  "text-sm font-light leading-relaxed mb-8",
                  "text-(--tpl-text-tertiary)",
                )}
              >
                {event.description}
              </p>
              {/* <p className="text-sm font-light leading-relaxed mb-8">
                {event.description
                  .replace(new RegExp(",\\s*", "g"), ",")
                  .split(",")
                  .map((item, index) => (
                    <span key={index}>
                      {item}
                      <br />
                    </span>
                  ))}
              </p> */}
              {event.mapsUrl && (
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 text-xs uppercase px-3 py-2 rounded-md transition-all duration-500",
                    "text-(--tpl-btn-text-secondary)",
                    "bg-(--tpl-btn-bg-secondary) hover:bg-(--tpl-btn-bg-secondary)/80",
                  )}
                >
                  View Map
                  <ArrowUpRight strokeWidth={1.5} />
                </a>
              )}
            </div>
          </EventCard>
        ))}
      </div>
    </section>
  );
}
