"use client";

import { ArrowUpRight, Building2 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { formatDate } from "@/features/invitation/lib/datetime";
import { InvitationState } from "@/features/invitation/types/invitation.type";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
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
      className="relative bg-(--tpl-bg-secondary)/20 p-8 border border-transparent hover:border-rosegold/30 rounded-3xl transition-colors duration-500 text-center"
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

export function EventsAgnimaya({ inv }: Props) {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section className="px-8 py-24 bg-(--tpl-bg-primary) border-b border-(--tpl-bg-tertiary)/10">
      <motion.div
        ref={headingRef}
        className="text-center mb-12"
        initial="hidden"
        animate={headingInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <h2 className="font-(family-name:--tpl-font-heading) font-light text-3xl text-(--tpl-text-primary) tracking-tight mb-4">
          Celebration Timeline
        </h2>
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-rosegold/40" />
          <span className="text-(--tpl-text-secondary) font-(family-name:--tpl-font-body) text-[11px] tracking-[0.25em] uppercase">
            Our Events
          </span>
          <span className="h-px w-8 bg-rosegold/40" />
        </div>
      </motion.div>

      <div className="space-y-8">
        {inv.events.map((event, index) => (
          <EventCard key={event.id} delay={index * 0.15}>
            <div className="absolute top-8 right-8 text-(--tpl-text-secondary) opacity-60">
              <Building2 strokeWidth={1.5} />
            </div>
            <span className="inline-block py-1 text-(--tpl-text-secondary) text-xs font-(family-name:--tpl-font-body) tracking-[0.2em] font-medium uppercase mb-4 border-b border-(--tpl-bg-tertiary)/20">
              {formatDate(event.date, "PP")}
            </span>
            <h3 className="text-2xl font-(family-name:--tpl-font-heading) text-(--tpl-text-primary) tracking-tight mb-2">
              {event.title}
            </h3>
            <p className="text-(--tpl-text-secondary) text-base italic mb-2">
              {event.timeStart}
              {event.timeEnd && ` - ${event.timeEnd}`}
              {event.timezone && ` ${event.timezone}`}
            </p>
            {event.locationName && (
              <p className="text-(--tpl-text-secondary) text-sm italic mb-6">
                {event.locationName}
              </p>
            )}
            {event.mapsUrl && (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-(--tpl-text-secondary) text-[10px] font-(family-name:--tpl-font-body) uppercase tracking-[0.2em] hover:text-(--tpl-text-tertiary) transition-colors"
              >
                View Map <ArrowUpRight strokeWidth={1.5} />
              </a>
            )}
          </EventCard>
        ))}
      </div>
    </section>
  );
}
