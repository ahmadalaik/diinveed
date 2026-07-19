"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion } from "motion/react";

interface Props {
  inv: InvitationState;
  onOpen: (open: boolean) => void;
  guestName?: string;
}

export function EnvelopeAgnimaya({ inv, onOpen, guestName }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpen(true);
    }, 800);
  };

  return (
    <section
      className={cn(
        "fixed right-0 top-0 z-50 transition-transform duration-1000 ease-in-out w-full lg:w-[30%] h-svh flex justify-center items-center px-8 py-14 text-center bg-(--tpl-bg-primary)",
        isClosing ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        {inv.coverMobileImage && (
          <Image
            src={inv.coverMobileImage}
            alt="Thumbnail"
            fill
            sizes="(max-width: 1024px) 100vw, 25vw"
            className="object-cover opacity-90 filter sepia-[0.15] contrast-[0.95]"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-ivory/70 via-ivory/30 to-ivory" />
      </div>

      <motion.div 
        className="relative z-10 flex flex-col justify-end h-full w-full gap-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.3, delayChildren: 0.4 } },
        }}
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
          }}
        >
          <p className="text-(--tpl-text-secondary) text-xs tracking-[0.3em] font-(family-name:--tpl-font-body) uppercase mb-2">
            The Wedding of
          </p>
        </motion.div>

        {inv.isBrideFirst ? (
          <motion.h1
            className="text-4xl lg:text-5xl font-(family-name:--tpl-font-heading) font-light tracking-tight text-(--tpl-text-primary) leading-none"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
          >
            {inv.brideNickname}{" "}
            <span className="text-(--tpl-text-tertiary) italic text-5xl lg:text-6xl align-middle mx-1 opacity-80">
              &amp;
            </span>{" "}
            {inv.groomNickname}
          </motion.h1>
        ) : (
          <motion.h1
            className="text-4xl lg:text-5xl font-(family-name:--tpl-font-heading) font-light tracking-tight text-(--tpl-text-primary) leading-none"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
          >
            {inv.groomNickname}{" "}
            <span className="text-(--tpl-text-tertiary) italic text-5xl lg:text-6xl align-middle mx-1 opacity-80">
              &amp;
            </span>{" "}
            {inv.brideNickname}
          </motion.h1>
        )}

        <motion.div 
          className="flex flex-col gap-1 mt-2"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
          }}
        >
          <div className="flex items-baseline-last justify-center">
            <span className="font-(family-name:--tpl-font-heading) font-medium text-2xl text-(--tpl-text-primary)">
              Dear {guestName ?? "Guest"}
            </span>
          </div>
          <p className="font-(family-name:--tpl-font-heading) text-sm text-(--tpl-text-secondary) italic leading-relaxed text-balance">
            Sorry if there are any mistakes in writing names or titles
          </p>
        </motion.div>

        <motion.div
          className="mt-5"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
          }}
        >
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 mx-auto px-8 py-3.5 bg-(--tpl-btn-bg-primary) text-(--tpl-text-tertiary) hover:bg-(--tpl-btn-bg-secondary) hover:text-white transition-all duration-400 tracking-[0.2em] text-xs font-(family-name:--tpl-font-body) uppercase rounded-full shadow-sm hover:shadow-lg cursor-pointer"
            onClick={handleOpen}
          >
            Buka Undangan
            <ArrowRight className="size-4 animate-[envelope-bounce_3s_ease-in-out_infinite_forwards]" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
