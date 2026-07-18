"use client";

import { MoveDown } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { InvitationState } from "@/features/invitation/types/invitation.type";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay,
    },
  }),
};

interface Props {
  inv: InvitationState;
}

export function KalandraQuote({ inv }: Props) {
  return (
    <section className="relative h-svh w-full overflow-hidden flex flex-col items-center px-8 py-22 justify-between">
      <div className="flex flex-col h-full w-full gap-6">
        <motion.div
          className="flex items-center gap-2.5 drop-shadow-md font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <p className="text-3xl tracking-[0.2em] mb-4">
            {inv.isBrideFirst
              ? inv.brideNickname?.charAt(0)
              : inv.groomNickname?.charAt(0)}
          </p>
          <div className="w-px h-14 rotate-25 bg-(--tpl-text-primary)/60" />
          <p className="text-3xl tracking-[0.2em] mt-4">
            {inv.isBrideFirst
              ? inv.groomNickname?.charAt(0)
              : inv.brideNickname?.charAt(0)}
          </p>
        </motion.div>
        {inv.quote && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className={cn(
              "font-(family-name:--tpl-font-body) text-sm italic leading-loose text-balance drop-shadow-md mt-4",
              // "font-(family-name:--tpl-font-body)",
              // "[text-transform:var(--tpl-transform-body)]",
              "text-(--tpl-text-primary)",
            )}
          >
            &ldquo;{inv.quote}&rdquo;
          </motion.p>
        )}

        {inv.quoteReference && (
          <motion.h4
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className={cn(
              "text-base font-light drop-shadow-md",
              "font-(family-name:--tpl-font-body)",
              "text-(--tpl-text-primary)",
              "[text-transform:var(--tpl-transform-body)]",
            )}
          >
            {inv.quoteReference}
          </motion.h4>
        )}
      </div>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1.3}
        className={cn(
          "mt-10 flex justify-center animate-bounce",
          "text-(--tpl-text-primary)",
        )}
      >
        <MoveDown strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
