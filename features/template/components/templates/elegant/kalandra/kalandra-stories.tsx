"use client";

import { formatDate } from "@/features/invitation/lib/datetime";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { Milestone } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface StoryCardProps {
  delay: number;
  children: React.ReactNode;
}

function StoryCard({ delay, children }: StoryCardProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col justify-center text-center items-center gap-2 group",
        "hover:border-(--tpl-text-tertiary)/30",
      )}
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

export function KalandraStories({ inv }: Props) {
  return (
    <section
      className={cn(
        "relative px-8 py-16",
        // "bg-(--tpl-bg-secondary)",
      )}
      style={{ clipPath: "inset(0)" }}
    >
      <div className="relative z-10">
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
              "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
            )}
          >
            Love Story
          </h2>
        </motion.div>

        <div className="space-y-6">
          {inv.stories.items.map((story, i) => (
            <StoryCard key={story.id} delay={i * 0.15}>
              <div
                className={cn(
                  "mb-3 flex justify-center items-center p-2 rounded-full",
                  "bg-(--tpl-bg-primary)",
                  "text-(--tpl-text-tertiary)",
                )}
              >
                <Milestone strokeWidth={1.5} />
              </div>
              <div className="pb-8">
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
                    "text-xs font-semibold tracking-widest mt-2 mb-4",
                    "text-(--tpl-text-primary) [text-transform:var(--tpl-transform-heading)]",
                  )}
                >
                  {story.year && formatDate(story.year, "PPP")}
                </p>
                <p
                  className={cn(
                    "text-balance text-sm font-normal leading-relaxed",
                    "text-(--tpl-text-primary)",
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
