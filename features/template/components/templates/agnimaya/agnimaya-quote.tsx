"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { InvitationState } from "@/features/invitation/types/invitation.type";

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

export function QuoteAgnimaya({ inv }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="px-8 py-14 bg-(--tpl-bg-secondary)/10 border-b border-(--tpl-bg-tertiary)/10 text-center"
    >
      <motion.div
        className="flex justify-center items-center gap-4 mb-8"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <p className="text-3xl font-(family-name:--tpl-font-heading) tracking-[0.2em] text-(--tpl-text-primary)/80">
          {inv.brideNickname && inv.brideNickname.charAt(0)}
        </p>
        <div className="w-px h-16 bg-rosegold/50" />
        <p className="text-3xl font-(family-name:--tpl-font-heading) tracking-[0.2em] text-(--tpl-text-primary)/80">
          {inv.groomNickname && inv.groomNickname.charAt(0)}
        </p>
      </motion.div>

      {inv.quote && (
        <motion.p
          className="font-(family-name:--tpl-font-heading) text-base text-(--tpl-text-secondary) italic leading-relaxed"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.25)}
        >
          &ldquo;{inv.quote}&rdquo;
        </motion.p>
      )}

      {inv.quoteReference && (
        <motion.h4
          className="font-(family-name:--tpl-font-heading) text-lg font-medium mt-4 italic text-(--tpl-text-secondary)"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.45)}
        >
          {inv.quoteReference}
        </motion.h4>
      )}
    </section>
  );
}
