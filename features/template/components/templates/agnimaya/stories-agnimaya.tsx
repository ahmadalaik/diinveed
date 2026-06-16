"use client";

import { format } from "date-fns";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { InvitationState } from "@/features/invitation/types/invitation.type";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

function StoryCard({
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

export function StoriesAgnimaya({ inv }: Props) {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section className="px-8 py-24 bg-champagne/10 border-b border-camel/10">
      <motion.div
        ref={headingRef}
        className="flex items-center gap-4 mb-10"
        initial="hidden"
        animate={headingInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <div className="h-px w-12 bg-rosegold" />
        <span className="text-gold font-sans text-[10px] tracking-[0.25em] uppercase">
          Our Story
        </span>
      </motion.div>

      <div className="space-y-10">
        {inv.stories.map((story, index) => (
          <StoryCard key={story.id} delay={index * 0.15}>
            <h2 className="text-2xl font-serif font-light text-espresso mb-2">
              {story.title}
            </h2>
            {story.year && (
              <p className="text-gold font-sans text-[10px] tracking-[0.2em] uppercase mb-4">
                {format(new Date(story.year), "yyyy")}
              </p>
            )}
            <p className="text-sm text-espresso/70 leading-loose font-sans font-light">
              {story.body}
            </p>
          </StoryCard>
        ))}
      </div>
    </section>
  );
}
