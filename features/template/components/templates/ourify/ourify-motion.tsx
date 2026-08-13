"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const OURIFY_STANDARD_SECTION_CLASS = "px-5 py-14";
export const OURIFY_VERSE_SECTION_CLASS = "px-[26px] py-[72px]";
export const OURIFY_COVER_TRANSITION = {
  transformDuration: 1.1,
  opacityDuration: 0.8,
  ease: [0.7, 0, 0.3, 1] as const,
};

type OurifyRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function OurifyReveal({
  children,
  className,
  delay = 0,
}: OurifyRevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 18,
            }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.45,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type OurifySectionHeadingProps = {
  id: string;
  eyebrow: string;
  children: React.ReactNode;
  description?: string;
  className?: string;
};

export function OurifySectionHeading({
  id,
  eyebrow,
  children,
  description,
  className,
}: OurifySectionHeadingProps) {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      <p className="text-[11px] leading-none font-bold tracking-[0.12em] text-(--tpl-text-tertiary) uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="scroll-mt-20 text-[27.2px] leading-[32.64px] font-extrabold tracking-[-0.035em] text-balance text-(--tpl-text-primary)"
      >
        {children}
      </h2>
      {description ? (
        <p className="max-w-sm text-sm leading-6 text-(--tpl-text-secondary)">
          {description}
        </p>
      ) : null}
    </div>
  );
}
