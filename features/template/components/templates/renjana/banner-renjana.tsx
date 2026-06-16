"use client";

import Image from "next/image";
import { formatDate } from "@/features/invitation/lib/datetime";
import { CalendarHeart } from "lucide-react";
import { motion } from "motion/react";
import { InvitationState } from "@/features/invitation/types/invitation.type";

interface Props {
  inv: InvitationState;
}

export function BannerRenjana({ inv }: Props) {
  const first = inv.isBrideFirst ? inv.brideNickname : inv.groomNickname;
  const second = inv.isBrideFirst ? inv.groomNickname : inv.brideNickname;

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-[#a85d6b]">
      <div className="absolute inset-0">
        {inv.coverImage && (
          <Image
            src={inv.coverImage}
            alt="Cover Image"
            fill
            preload
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover animate-slow-zoom"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#3a1f24]/70 via-transparent to-[#3a1f24]/20" />
        <div className="absolute inset-0 bg-[#a85d6b]/10 mix-blend-overlay" />
      </div>

      <motion.div
        className="absolute bottom-14 inset-x-0 z-20 text-white text-center px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
        }}
      >
        <motion.p
          className="uppercase text-sm italic text-[#f6e3e2] tracking-widest font-(family-name:--font-serif) font-medium mb-5"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
          }}
        >
          The Wedding Celebration
        </motion.p>

        <motion.h1
          className="text-7xl leading-none font-(family-name:--font-script) mb-2 drop-shadow-lg"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
          }}
        >
          {first} <span className="text-5xl opacity-80 mx-1">&amp;</span> {second}
        </motion.h1>

        <motion.div
          className="mt-6 flex items-center justify-center gap-3 text-[#f6e3e2]"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
          }}
        >
          <CalendarHeart strokeWidth={1.5} />
          <span className="font-(family-name:--font-serif) text-lg tracking-wide">
            {formatDate(inv.events[0]?.date, "PPP")}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
