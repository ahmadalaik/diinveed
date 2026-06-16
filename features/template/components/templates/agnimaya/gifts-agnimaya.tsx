"use client";

import { Gift, Wallet } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import CopyButton from "../shared/copy-button";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
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
      className="bg-ivory p-8 border border-transparent hover:border-rosegold/30 rounded-3xl transition-colors duration-300 shadow-sm text-left"
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

export function GiftsAgnimaya({ inv }: Props) {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section className="px-8 py-24 bg-champagne/10 border-b border-camel/10">
      <motion.div
        ref={headingRef}
        className="text-center mb-12"
        initial="hidden"
        animate={headingInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <div className="w-12 h-12 rounded-full border border-rosegold flex items-center justify-center mx-auto mb-6 text-rosegold">
          <Gift strokeWidth={1.5} />
        </div>
        <h2 className="font-serif font-light text-3xl text-espresso tracking-tight mb-4">
          Gifts
        </h2>
        <p className="text-sm text-camel font-light leading-relaxed">
          Your presence at our wedding is the greatest gift of all. However, if
          you wish to honor us with a gift, we would greatly appreciate it.
        </p>
      </motion.div>

      <div className="space-y-6">
        {inv.gifts.map((gift, index) => (
          <GiftCard key={gift.id} delay={index * 0.15}>
            <h4 className="flex items-center justify-between text-lg text-gold tracking-widest uppercase font-serif font-medium mb-6">
              {gift.provider}
              <Wallet strokeWidth={1.5} className="text-gold/80" />
            </h4>
            <div className="space-y-4 text-sm text-espresso/70">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-camel font-light">Account Name</span>
                <span className="font-medium text-espresso">
                  {gift.accountName}
                </span>
              </div>
              <div className="h-px bg-camel/10" />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-camel font-light">
                  Account Number
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-espresso">
                    {gift.accountNumber}
                  </span>
                  <CopyButton
                    className="bg-espresso hover:bg-gold text-ivory hover:text-white transition-all duration-500 tracking-wider text-xs uppercase rounded-sm shadow-sm font-medium relative flex items-center justify-center size-8"
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
