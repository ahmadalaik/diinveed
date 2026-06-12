"use client";

import { MoveDown } from "lucide-react";
import { motion } from "motion/react";
import { formatDate } from "@/features/invitation/lib/datetime";
import { InvitationState } from "@/features/invitation/types/invitation.type";

interface Props {
  inv: InvitationState;
}

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

export function PrologAgnimaya({ inv }: Props) {
  return (
    <section className="relative h-svh w-full overflow-hidden flex justify-center items-center px-8 py-10 text-center">
      <div className="flex flex-col justify-end h-full w-full">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
          <span className="text-gold text-xs tracking-[0.3em] font-sans uppercase mb-4 block">
            Save the Date
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="text-espresso leading-none text-6xl font-serif font-light tracking-tight mb-3"
        >
          {inv.brideNickname}{" "}
          <span className="text-rosegold italic text-4xl align-middle mx-2 opacity-80">
            &amp;
          </span>{" "}
          {inv.groomNickname}
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.85}
        >
          <p className="font-sans text-2xl italic text-camel tracking-wide mb-4">
            {formatDate(inv.events[0]?.date, "PP")}
          </p>
          <p className="font-serif text-base italic text-espresso/70 leading-relaxed text-balance">
            &ldquo;We invite you to share in our joy and request your presence at
            our wedding.&rdquo;
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.3}
          className="mt-10 flex justify-center text-gold animate-bounce"
        >
          <MoveDown strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  );
}
