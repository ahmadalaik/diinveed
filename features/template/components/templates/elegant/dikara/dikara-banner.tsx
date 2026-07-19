"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { InvitationState } from "@/features/invitation/types/invitation.type";

interface Props {
  inv: InvitationState;
}

export function DikaraBanner({ inv }: Props) {
  return (
    <aside className="relative w-full h-[60vh] lg:h-dvh lg:sticky lg:top-0 overflow-hidden">
      <div className="absolute inset-0">
        {inv.coverDesktopImage && (
          <Image
            src={inv.coverDesktopImage}
            alt="Cover Image"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay" />
      </div>

      <motion.div
        className={cn(
          "absolute bottom-10 left-6 lg:bottom-16 lg:left-16 z-20 max-w-4xl",
          "text-(--tpl-text-primary)",
        )}
        initial="hidden"
        animate="visible"
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
          className={cn(
            "text-sm tracking-[0.24em] font-light mb-6 pl-4",
            "[text-transform:var(--tpl-transform-body)]",
          )}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
        >
          The Wedding of
        </motion.p>

        <motion.h1
          className={cn(
            "lg:text-9xl leading-none capitalize text-7xl mb-2 drop-shadow-lg",
            "font-(family-name:--tpl-font-heading)",
          )}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.9, ease: "easeOut" },
            },
          }}
        >
          {inv.isBrideFirst ? inv.brideNickname : inv.groomNickname}{" "}
          <span className="lg:text-7xl sm:ml-0 lg:ml-24 xl:ml-0 text-5xl opacity-90 ml-16">
            &amp;
          </span>{" "}
          {inv.isBrideFirst ? inv.groomNickname : inv.brideNickname}
        </motion.h1>
      </motion.div>
    </aside>
  );
}
