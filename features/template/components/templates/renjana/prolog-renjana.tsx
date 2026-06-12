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

export function PrologRenjana({ inv }: Props) {
  return (
    <section className="relative h-svh w-full overflow-hidden flex justify-center items-center px-8 py-10 text-center">
      <div className="flex flex-col justify-end h-full w-full">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <p className="text-xs [text-transform:uppercase] tracking-[0.2em] text-[#c98a96] mb-4">
            The Wedding of
          </p>
        </motion.div>

        {inv.isBrideFirst ? (
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="text-[#a85d6b] leading-none text-5xl font-(family-name:--font-script) mb-2"
          >
            {inv.brideNickname}{" "}
            <span className="text-3xl opacity-80 mx-2">&amp;</span>{" "}
            {inv.groomNickname}
          </motion.h1>
        ) : (
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="text-[#a85d6b] leading-none text-5xl font-(family-name:--font-script) mb-2"
          >
            {inv.groomNickname}{" "}
            <span className="text-3xl opacity-80 mx-2">&amp;</span>{" "}
            {inv.brideNickname}
          </motion.h1>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.85}
        >
          <div className="flex items-baseline-last justify-center">
            <span className="font-(family-name:--font-serif) font-medium text-3xl text-[#a85d6b] mb-4">
              {formatDate(inv.events[0]?.date, "PP")}
            </span>
          </div>
          <p className="font-(family-name:--font-serif) text-lg italic text-[#9a7e7e] leading-relaxed">
            &ldquo;Kami mengundang Anda untuk hadir dan
            berbagi kebahagiaan di hari pernikahan kami.&rdquo;
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.3}
          className="mt-10 flex justify-center text-[#c98a96] animate-bounce"
        >
          <MoveDown strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  );
}
