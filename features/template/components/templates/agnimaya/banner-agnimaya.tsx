"use client";

import Image from "next/image";
import { CalendarHeart } from "lucide-react";
import { formatDate } from "@/features/invitation/lib/datetime";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion } from "motion/react";

interface Props {
  inv: InvitationState;
}

export default function BannerAgnimaya({ inv }: Props) {
  return (
    <aside className="relative w-full h-[60vh] lg:h-svh lg:sticky lg:top-0 overflow-hidden bg-espresso">
      <div className="absolute inset-0">
        {inv.coverImage && (
          <Image
            src={inv.coverImage}
            alt="Cover Image"
            fill
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover opacity-90 animate-slow-zoom filter sepia-[0.15] contrast-[0.95]"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-espresso/80 via-espresso/20 to-espresso/10" />
      </div>

      <motion.div
        className="absolute bottom-10 left-6 lg:bottom-16 lg:left-16 z-20 text-ivory max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2, delayChildren: 0.3 },
          },
        }}
      >
        <motion.p
          className="text-gold uppercase text-sm lg:text-base tracking-[0.3em] font-sans mb-6"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
        >
          The Wedding Celebration
        </motion.p>

        {inv.isBrideFirst ? (
          <motion.h1
            className="text-7xl lg:text-9xl leading-none font-serif font-light tracking-tight drop-shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.9, ease: "easeOut" },
              },
            }}
          >
            {inv.brideNickname}{" "}
            <span className="text-rosegold italic text-5xl lg:text-7xl align-middle mx-2 lg:mx-4 opacity-80">
              &amp;
            </span>{" "}
            {inv.groomNickname}
          </motion.h1>
        ) : (
          <motion.h1
            className="text-7xl lg:text-9xl leading-none font-serif font-light tracking-tight drop-shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.9, ease: "easeOut" },
              },
            }}
          >
            {inv.brideNickname}{" "}
            <span className="text-rosegold italic text-5xl lg:text-7xl align-middle mx-2 lg:mx-4 opacity-80">
              &amp;
            </span>{" "}
            {inv.groomNickname}
          </motion.h1>
        )}

        <motion.div
          className="mt-8 flex items-center gap-4 text-champagne"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
        >
          <CalendarHeart strokeWidth={1.5} />
          <span className="font-serif text-xl italic tracking-wide">
            {formatDate(inv.events[0]?.date, "PPP")}
          </span>
        </motion.div>
      </motion.div>
    </aside>
  );
}
