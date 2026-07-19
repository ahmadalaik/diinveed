"use client";

import { formatDate } from "@/features/invitation/lib/datetime";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { Milestone } from "lucide-react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
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
  inView,
  children,
}: {
  delay: number;
  inView: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn(
        "flex justify-start items-start gap-6 group",
        "hover:border-(--tpl-text-tertiary)/30",
      )}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp(delay)}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  inv: InvitationState;
}

export function DikaraStories({ inv }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      className={cn("relative min-h-dvh px-8 py-24 snap-start")}
      style={{ clipPath: "inset(0)" }}
    >
      <div className="absolute inset-0 bg-black/25 -z-10" />
      <div className="relative z-10">
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.15)}
        >
          <h2
            className={cn(
              "font-medium text-4xl tracking-wider",
              "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
            )}
          >
            Our Love Story
          </h2>
        </motion.div>

        <div className="space-y-6">
          {inv.stories.items.map((story, i) => (
            <StoryCard key={story.id} delay={0.35 + i * 0.2} inView={isInView}>
              <div className="relative flex flex-col items-center self-stretch">
                <div
                  className={cn(
                    "relative z-10 flex justify-center items-center p-2 rounded-full border shrink-0",
                    "border-(--tpl-bg-secondary) bg-(--tpl-bg-tertiary)",
                    "text-(--tpl-text-secondary)",
                  )}
                >
                  <Milestone strokeWidth={1.5} />
                </div>
                {i !== inv.stories.items.length - 1 && (
                  <div className="absolute top-0 -bottom-6 left-1/2 w-px bg-(--tpl-bg-primary) -translate-x-1/2" />
                )}
              </div>
              <div className="pb-8">
                <p
                  className={cn(
                    "text-xs font-semibold tracking-widest mt-0 mb-2",
                    "text-(--tpl-text-tertiary) [text-transform:var(--tpl-transform-heading)]",
                  )}
                >
                  {story.year && formatDate(story.year, "PPP")}
                </p>

                <h3
                  className={cn(
                    "font-medium tracking-wider text-2xl",
                    "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
                  )}
                >
                  {story.title}
                </h3>

                <p
                  className={cn(
                    "text-balance text-sm font-normal leading-relaxed mt-3",
                    "text-(--tpl-text-primary) [text-transform:var(--tpl-transform-heading)]",
                  )}
                >
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
