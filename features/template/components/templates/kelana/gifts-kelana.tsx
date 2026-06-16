"use client";

import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion, useInView } from "motion/react";
import { Wallet } from "lucide-react";
import { useRef } from "react";
import CopyButton from "../shared/copy-button";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay,
    },
  },
});

function GiftCard({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="p-5 rounded-xl text-center hover:bg-white/5 hover:backdrop-blur-sm transition-[background-color,backdrop-filter] duration-300 group"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp(delay)}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  inv: InvitationState;
}

export function GiftsKelana({ inv }: Props) {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section className="px-8 py-16 border-b border-[#e5e0d6]">
      <motion.div
        ref={headingRef}
        className="text-center mb-10"
        initial="hidden"
        animate={headingInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <h2 className="font-(family-name:--tpl-font-heading) font-medium text-3xl text-stone-50 tracking-tight">
          Gifts
        </h2>
        <p className="mt-3 px-6 text-base text-stone-200 font-(family-name:--tpl-font-heading) font-light leading-relaxed">
          Your presence at our wedding is the greatest gift of all. However, if
          you wish to honor us with a gift, we would greatly appreciate it.
        </p>
      </motion.div>

      <div className="space-y-6">
        {inv.gifts.map((gift, index) => (
          <GiftCard key={gift.id} delay={index * 0.15}>
            <h4 className="text-xl text-stone-50 mb-6 flex items-center gap-3 font-normal font-(family-name:--tpl-font-heading)">
              <Wallet strokeWidth={1.5} className="text-stone-50/80" />
              {gift.provider}
            </h4>
            <div className="space-y-3 text-sm text-stone-50 tracking-wide">
              <div className="flex flex-col items-start">
                <span className="font-light">Account Name</span>
                <span className="font-medium">{gift.accountName}</span>
              </div>
              <div className="h-px bg-stone-50/50" />
              <div className="flex flex-col items-start mb-2">
                <span className="font-light">Account Number</span>
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{gift.accountNumber}</span>
                  <CopyButton
                    className="bg-stone-50 hover:bg-(--tpl-tertiary) text-(--tpl-primary) hover:text-stone-50 transition-all duration-500 tracking-wider text-xs uppercase rounded-sm shadow-sm font-medium"
                    value={gift.accountNumber}
                  />
                </div>
              </div>
            </div>
          </GiftCard>
        ))}
      </div>
    </section>
  );
}
