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

export function CoupleAgnimaya({ inv }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-8 py-24 border-b border-(--tpl-bg-tertiary)/10 bg-(--tpl-bg-primary)">
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <span className="text-(--tpl-text-secondary) font-(family-name:--tpl-font-body) text-xs tracking-[0.3em] uppercase block mb-4">
          Meet the Couple
        </span>
        <h2 className="font-(family-name:--tpl-font-heading) font-light text-3xl text-(--tpl-text-primary) tracking-tight">
          Written in the Stars
        </h2>
      </motion.div>

      <div className="space-y-10">
        {/* Bride */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.2)}
        >
          <div className="relative w-40 h-52 mb-6 overflow-hidden rounded-3xl bg-(--tpl-bg-secondary)/30">
            <Image
              fill
              src={inv.brideImage || DEMO_BRIDE_IMAGE}
              alt="Bride"
              sizes="(max-width: 1024px) 60vw, 160px"
              className="object-cover lg:grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-(family-name:--tpl-font-heading) text-2xl text-(--tpl-text-primary) mb-2">{inv.brideName}</h3>
          <p className="text-(--tpl-text-tertiary) font-(family-name:--tpl-font-body) text-[10px] tracking-[0.2em] uppercase mb-2">
            The Bride
          </p>
          <p className="font-(family-name:--tpl-font-heading) text-sm text-(--tpl-text-secondary) italic text-balance">
            {inv.brideDescription}
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="text-center text-champagne font-(family-name:--tpl-font-heading) text-2xl italic"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn(0.45)}
        >
          &amp;
        </motion.div>

        {/* Groom */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.55)}
        >
          <div className="relative w-40 h-52 mb-6 overflow-hidden rounded-3xl bg-(--tpl-bg-secondary)/30">
            <Image
              fill
              src={inv.groomImage || DEMO_GROOM_IMAGE}
              alt="Groom"
              sizes="(max-width: 1024px) 60vw, 160px"
              className="object-cover lg:grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-(family-name:--tpl-font-heading) text-2xl text-(--tpl-text-primary) mb-2">{inv.groomName}</h3>
          <p className="text-(--tpl-text-tertiary) font-(family-name:--tpl-font-body) text-[10px] tracking-[0.2em] uppercase mb-2">
            The Groom
          </p>
          <p className="font-(family-name:--tpl-font-heading) text-sm text-(--tpl-text-secondary) italic text-balance">
            {inv.groomDescription}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
