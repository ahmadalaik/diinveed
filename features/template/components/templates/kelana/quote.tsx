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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="px-8 py-12 bg-[#fcfbf9] border-b border-[#e5e0d6] text-center"
    >
      <motion.div
        className="flex justify-center items-center gap-4 font-script mb-8"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <p className="text-3xl tracking-[0.2em] text-[#2c2c2c]/80">
          {inv.brideNickname && inv.brideNickname.charAt(0)}
        </p>
        <div className="w-px h-16 bg-[#6b7c62]/60"></div>
        <p className="text-3xl tracking-[0.2em] text-[#2c2c2c]/80">
          {inv.groomNickname && inv.groomNickname.charAt(0)}
        </p>
      </motion.div>

      {inv.quote && (
        <motion.p
          className="font-serif text-base text-stone-500 italic leading-relaxed"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.25)}
        >
          &ldquo;{inv.quote}&rdquo;
        </motion.p>
      )}

      {inv.quoteReference && (
        <motion.h4
          className="font-serif text-lg font-medium mt-4 italic text-[#6b7c62]"
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
