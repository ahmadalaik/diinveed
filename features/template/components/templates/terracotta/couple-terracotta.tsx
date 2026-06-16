"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { DEMO_BRIDE_IMAGE, DEMO_GROOM_IMAGE } from "@/lib/demo-assets";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  inv: InvitationState;
}

export function CoupleTerracotta({ inv }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-8 py-24 border-b border-[#e5e0d6] bg-[#fcfbf9]">
      <motion.div
        className="text-center mb-18"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <h2 className="font-serif font-medium text-3xl text-[#2c2c2c] tracking-tight">
          Meet the Couple
        </h2>
      </motion.div>

      <div className="space-y-12">
        {/* Bride */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.2)}
        >
          <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border border-[#d4cbb3] p-1">
            <Image
              width={200}
              height={200}
              src={inv.brideImage || DEMO_BRIDE_IMAGE}
              alt="Bride"
              className="w-full h-full object-cover rounded-full lg:grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-script text-3xl text-[#2c2c2c]">{inv.brideName}</h3>
          <p className="text-xs font-serif uppercase tracking-widest text-[#6b7c62] mt-1 mb-2">
            Mempelai Wanita
          </p>
          <p className="font-serif font-medium text-balance text-sm text-stone-500 italic">
            {inv.brideDescription}
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="text-center text-[#d4cbb3] font-serif text-2xl italic"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn(0.45)}
        >
          &amp;
        </motion.div>

        {/* Groom */}
        <motion.div
          className="flex flex-col items-center text-center mb-4"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.55)}
        >
          <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border border-[#d4cbb3] p-1">
            <Image
              width={200}
              height={200}
              src={inv.groomImage || DEMO_GROOM_IMAGE}
              alt="Groom"
              className="w-full h-full object-cover rounded-full lg:grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-script text-3xl text-[#2c2c2c]">{inv.groomName}</h3>
          <p className="text-xs font-serif uppercase tracking-widest text-[#6b7c62] mt-1 mb-2">
            Mempelai Pria
          </p>
          <p className="font-serif font-medium text-balance text-sm text-stone-500 italic">
            {inv.groomDescription}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
