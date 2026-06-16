"use client";

import Image from "next/image";
import { formatDate } from "@/features/invitation/lib/datetime";
import { CalendarHeart } from "lucide-react";
import { motion } from "motion/react";
import { InvitationState } from "@/features/invitation/types/invitation.type";

interface Props {
  inv: InvitationState;
}

export function BannerKelana({ inv }: Props) {
  return (
    <aside className="relative w-full h-[60vh] lg:h-dvh lg:sticky lg:top-0 overflow-hidden bg-stone-900">
      <div className="absolute inset-0">
        {inv.coverImage && (
          <Image
            src={inv.coverImage}
            alt="Cover Image"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover animate-slow-zoom"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay"></div>
      </div>

      <motion.div
        className="absolute bottom-10 left-6 lg:bottom-16 lg:left-16 z-20 text-white max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.3,
            },
          },
        }}
      >
        <motion.p
          className="lg:text-xl [text-transform:var(--tpl-transform-heading)] text-lg italic text-(--tpl-secondary) tracking-widest font-(family-name:--tpl-font-heading) font-medium border-(--tpl-secondary) border-l-2 mb-6 pl-4"
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
            className="lg:text-9xl leading-none text-7xl font-(family-name:--tpl-font-display) mb-2 drop-shadow-lg"
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
            <span className="lg:text-7xl sm:ml-0 lg:ml-24 xl:ml-0 text-5xl opacity-80 ml-16">
              &amp;
            </span>{" "}
            {inv.groomNickname}
          </motion.h1>
        ) : (
          <motion.h1
            className="lg:text-9xl leading-none text-7xl font-(family-name:--tpl-font-display) mb-2 drop-shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.9, ease: "easeOut" },
              },
            }}
          >
            {inv.groomNickname}{" "}
            <span className="lg:text-7xl sm:ml-0 lg:ml-24 xl:ml-0 text-5xl opacity-80 ml-16">
              &amp;
            </span>{" "}
            {inv.brideNickname}
          </motion.h1>
        )}

        <motion.div
          className="mt-8 flex items-center gap-4 text-(--tpl-secondary)"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
        >
          <CalendarHeart />
          <span className="font-(family-name:--tpl-font-heading) text-xl tracking-wide">
            {formatDate(inv.events[0]?.date, "PPP")}
          </span>
        </motion.div>
      </motion.div>
    </aside>
  );
}
