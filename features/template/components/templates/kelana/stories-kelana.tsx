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
      className="flex flex-col justify-center text-center items-center gap-2 hover:border-(--tpl-tertiary)/30 group"
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

export function StoriesKelana({ inv }: Props) {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative px-8 py-16 bg-[#f4f1ea] border-b border-[#e5eed6]"
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
          <h2 className="font-(family-name:--tpl-font-heading) font-medium text-3xl text-(--tpl-primary) tracking-tight">
            Love Story
          </h2>
        </motion.div>

        <div className="space-y-6">
          {inv.stories.map((story, i) => (
            <StoryCard key={story.id} delay={i * 0.15}>
              <div className="text-(--tpl-tertiary) mb-3 flex justify-center items-center p-2 rounded-full border border-stone-300 bg-[#fcfbf9]/35">
                <Milestone strokeWidth={1.5} />
              </div>
              <div className="pb-8">
                <h3 className="font-(family-name:--tpl-font-display) font-medium tracking-wider text-2xl text-(--tpl-primary)">
                  {story.title}
                </h3>
                <p className="text-xs font-semibold text-(--tpl-tertiary) [text-transform:var(--tpl-transform-heading)] tracking-widest mt-2 mb-4">
                  {story.year && format(new Date(story.year), "yyyy")}
                </p>
                <p className="text-balance text-sm text-stone-500 font-normal leading-relaxed">
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
