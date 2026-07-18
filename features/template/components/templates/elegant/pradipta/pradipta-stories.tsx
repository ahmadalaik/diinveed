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

function StoryCard({
  delay,
  children,
  className,
}: {
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "flex flex-col gap-2 group",
        className
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

export function PradiptaStories({ inv }: Props) {
  return (
    <section
      className={cn(
        "relative px-8 py-20 border-b border-[#e5eed6]",
        "bg-(--tpl-bg-secondary)",
      )}
      style={{ clipPath: "inset(0)" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
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

        {/* Timeline Container */}
        <div className="relative space-y-10 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-(--tpl-text-tertiary)/25 md:before:left-1/2 md:before:-translate-x-1/2">
          {inv.stories.items.map((story, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={story.id}
                className="relative flex items-start md:items-center min-h-[120px] group"
              >
                {/* Timeline Dot / Node */}
                <div
                  className={cn(
                    "absolute left-4 -translate-x-1/2 flex justify-center items-center w-8 h-8 rounded-full border border-stone-300 z-10",
                    "bg-(--tpl-bg-primary) text-(--tpl-text-tertiary) shadow-xs transition-transform duration-300 group-hover:scale-110",
                    "md:left-1/2"
                  )}
                >
                  <Milestone strokeWidth={1.5} className="w-4 h-4" />
                </div>

                {/* Content Wrapper */}
                <div
                  className={cn(
                    "w-full pl-12 md:pl-0 md:w-1/2",
                    isEven
                      ? "md:pr-10 md:text-right md:ml-0"
                      : "md:pl-10 md:text-left md:ml-auto"
                  )}
                >
                  <StoryCard
                    delay={i * 0.15}
                    className={isEven ? "items-start md:items-end" : "items-start"}
                  >
                    <div className="pb-2">
                      {/* Year/Date Badge */}
                      <span
                        className={cn(
                          "inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest mb-3 border border-stone-300/60",
                          "bg-(--tpl-bg-primary)/50 text-(--tpl-text-tertiary) [text-transform:var(--tpl-transform-heading)]",
                        )}
                      >
                        {story.year && formatDate(story.year, "PPP")}
                      </span>
                      {/* Title */}
                      <h3
                        className={cn(
                          "font-medium tracking-wider text-xl md:text-2xl",
                          "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
                        )}
                      >
                        {story.title}
                      </h3>
                      {/* Body */}
                      <p
                        className={cn(
                          "text-balance text-[11px] text-stone-500 font-normal leading-normal mt-2 max-w-md",
                          isEven ? "md:ml-auto" : ""
                        )}
                      >
                        {story.body}
                      </p>
                    </div>
                  </StoryCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
