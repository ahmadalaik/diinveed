"use client";

import { MoveDown } from "lucide-react";
import { formatDate } from "@/features/invitation/lib/datetime";
import { motion } from "motion/react";
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

export function PrologKelana({ inv }: Props) {
  return (
    <section className="relative h-svh w-full overflow-hidden flex justify-center items-center px-8 py-10 text-center">
      <div className="flex flex-col justify-end h-full w-full">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#d4cbb3] mb-4">
            The Wedding of
          </p>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="text-stone-50 leading-none text-5xl font-script mb-2 drop-shadow-lg"
        >
          {inv.brideNickname}{" "}
          <span className="text-3xl opacity-80 mx-2">&amp;</span>{" "}
          {inv.groomNickname}
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.85}
        >
          <div className="flex items-baseline-last justify-center">
            <span className="font-serif font-medium text-3xl text-stone-50 mb-4">
              {formatDate(inv.date, "PP")}
            </span>
          </div>
          <p className="font-serif text-lg italic text-stone-200 leading-relaxed">
            &ldquo;We invite you to share in our joy and request your presence
            at our wedding.&rdquo;
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.3}
          className="mt-10 flex justify-center text-[#d4cbb3] animate-bounce"
        >
          <MoveDown strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  );
}
