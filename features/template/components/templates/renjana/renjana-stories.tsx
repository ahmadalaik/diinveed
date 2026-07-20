"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { format } from "date-fns";
import { Milestone } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

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
      className="flex flex-col justify-center text-center items-center gap-2 hover:border-[#c98a96]/30 group"
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

export function StoriesRenjana({ inv }: Props) {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative px-8 py-16 bg-[#fbf0ef] border-b border-[#f0d6d6]"
      style={{ clipPath: "inset(0)" }}
    >
      <div className="relative z-10">
        <motion.div
          ref={headingRef}
          className="text-center mb-10"
          initial="hidden"
          animate={headingInView ? "visible" : "hidden"}
          variants={fadeUp(0)}
        >
          <h2 className="font-(family-name:--font-serif) font-medium text-3xl text-[#a85d6b] tracking-tight">
            Love Story
          </h2>
        </motion.div>

        <div className="space-y-6">
          {inv.stories.items.map((story, i) => (
            <StoryCard key={story.id} delay={i * 0.15}>
              <div className="text-[#c98a96] mb-3 flex justify-center items-center p-2 rounded-full border border-[#e8c9c9] bg-white/50">
                <Milestone strokeWidth={1.5} />
              </div>
              <div className="pb-8">
                <h3 className="font-(family-name:--font-script) font-medium tracking-wider text-2xl text-[#a85d6b]">
                  {story.title}
                </h3>
                <p className="text-xs font-semibold text-[#c98a96] [text-transform:uppercase] tracking-widest mt-2 mb-4">
                  {story.year && format(new Date(story.year), "yyyy")}
                </p>
                <p className="text-balance text-sm text-[#6b4a4a] font-normal leading-relaxed">
                  {story.body}
                </p>
              </div>
            </StoryCard>
          ))}
        </div>
      </div>
    </section>
  );
}
