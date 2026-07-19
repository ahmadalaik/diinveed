"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  inv: InvitationState;
}

export function Quote({ inv }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      className="px-8 py-12 border-b border-(--tpl-bg-tertiary) text-center snap-start"
    >
      {inv.isBrideFirst ? (
        <motion.div
          className="flex justify-center items-center gap-4 font-(family-name:--tpl-font-heading) text-(--tpl-text-secondary)/80 mb-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.15)}
        >
          <p className="text-3xl tracking-[0.2em]">
            {inv.brideNickname && inv.brideNickname.charAt(0)}
          </p>
          <div className="w-px h-16 bg-(--tpl-text-tertiary)/60"></div>
          <p className="text-3xl tracking-[0.2em]">
            {inv.groomNickname && inv.groomNickname.charAt(0)}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="flex justify-center items-center gap-4 font-(family-name:--tpl-font-heading) mb-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.15)}
        >
          <p className="text-3xl tracking-[0.2em] text-(--tpl-text-secondary)/80">
            {inv.groomNickname && inv.groomNickname.charAt(0)}
          </p>
          <div className="w-px h-16 bg-(--tpl-bg-tertiary)/60"></div>
          <p className="text-3xl tracking-[0.2em] text-(--tpl-text-secondary)/80">
            {inv.brideNickname && inv.brideNickname.charAt(0)}
          </p>
        </motion.div>
      )}

      {inv.quote && (
        <motion.p
          className="font-(family-name:--tpl-font-body) text-xs text-(--tpl-text-secondary)/60 italic leading-relaxed"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.35)}
        >
          &ldquo;{inv.quote}&rdquo;
        </motion.p>
      )}

      {inv.quoteReference && (
        <motion.h4
          className="font-(family-name:--tpl-font-body) text-sm font-medium mt-4 text-(--tpl-text-tertiary)"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.55)}
        >
          {inv.quoteReference}
        </motion.h4>
      )}
    </section>
  );
}
