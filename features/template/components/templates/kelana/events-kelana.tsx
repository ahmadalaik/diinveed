"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { formatDate } from "@/features/invitation/lib/datetime";
import { ArrowUpRight, CalendarHeart } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

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

function EventCard({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="relative p-7 rounded-lg hover:bg-white/5 hover:backdrop-blur-sm transition-[background-color,backdrop-filter] duration-300 group"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp(delay)}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  inv: InvitationState;
}

export function EventsKelana({ inv }: Props) {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section className="px-8 py-16 border-b border-[#e5e0d6] bg-stone-900/20">
      <motion.div
        ref={headingRef}
        className="text-center mb-10"
        initial="hidden"
        animate={headingInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <h2 className="font-(family-name:--tpl-font-heading) font-medium text-3xl text-stone-50 tracking-tight">
          Wedding Event
        </h2>
      </motion.div>

      <div className="space-y-8">
        {inv.events.map((event, index) => (
          <EventCard key={event.id} delay={index * 0.15}>
            <div className="absolute top-8 right-8 text-stone-50/80">
              <CalendarHeart strokeWidth={1.5} />
            </div>
            <span className="inline-block py-1 text-(--tpl-secondary) text-xs tracking-[0.2em] font-semibold [text-transform:var(--tpl-transform-heading)] mb-4 border-b border-stone-50/20">
              {formatDate(event.date, "PP")}
            </span>
            <div className="text-stone-50 tracking-wide">
              <h3 className="font-(family-name:--tpl-font-display) text-3xl font-medium tracking-wider">
                {event.title}
              </h3>
              <p className="text-lg font-(family-name:--tpl-font-heading) font-semibold italic mt-2 mb-2">
                {event.timeStart}
                {event.timeEnd && ` - ${event.timeEnd}`}
                {event.timezone && ` ${event.timezone}`}
              </p>
              <p className="text-sm font-light leading-relaxed mb-8">
                {event.description
                  .replace(/,\s*/g, ",")
                  .split(",")
                  .map((item, index) => (
                    <span key={index}>
                      {item}
                      <br />
                    </span>
                  ))}
              </p>
              {event.mapsUrl && (
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-(--tpl-secondary) uppercase border-b/10 pb-0.5 hover:text-stone-50 transition-all duration-500"
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
