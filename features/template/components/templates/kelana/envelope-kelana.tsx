"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  inv: InvitationState;
  onOpen: (open: boolean) => void;
}

export function EnvelopeKelana({ inv, onOpen }: Props) {
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
        "fixed right-0 top-0 z-50 transition-transform duration-1000 ease-in-out w-full lg:w-[25%] h-svh flex justify-center items-center px-8 py-14 text-center bg-stone-900",
        isClosing ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="absolute inset-0 transition-opacity duration-5000 ease-in-out overflow-hidden opacity-80">
        <Image
          src={
            inv.coverImage ??
            "https://images.pexels.com/photos/36190389/pexels-photo-36190389.jpeg"
          }
          alt="Thumbnail"
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/40" />
      </div>

      <motion.div
        className="flex flex-col justify-end h-full w-full"
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
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#d4cbb3] mb-4 drop-shadow-md">
            The Wedding of
          </p>
        </motion.div>

        {inv.isBrideFirst ? (
          <motion.h1
            className="text-stone-50 leading-none text-5xl font-script mb-5 drop-shadow-lg"
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
            <span className="text-3xl opacity-80 mx-2">&amp;</span>{" "}
            {inv.groomNickname}
          </motion.h1>
        ) : (
          <motion.h1
            className="text-stone-50 leading-none text-5xl font-script mb-5 drop-shadow-lg"
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
            <span className="text-3xl opacity-80 mx-2">&amp;</span>{" "}
            {inv.brideNickname}
          </motion.h1>
        )}

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
        >
          <div className="flex items-baseline-last justify-center">
            <span className="font-serif font-medium text-2xl text-stone-50 mb-1 drop-shadow-md">
              Dear Guest
            </span>
          </div>
          <p className="font-serif text-sm text-stone-200 leading-relaxed text-balance drop-shadow-md">
            Sorry if there are any mistakes in writing names or titles
          </p>
        </motion.div>

        <motion.div
          className="mt-5"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
        >
          <button
            type="submit"
            className="flex items-center justify-center gap-2.5 mx-auto bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-stone-50/25 text-stone-50 py-3 px-6 rounded-md text-xs font-medium tracking-widest uppercase transition-colors duration-300 animate-[button-zoom_2s_ease-in-out_infinite_alternate] cursor-pointer drop-shadow-md"
            onClick={handleOpen}
          >
            <Mail strokeWidth={1.5} className="size-4" />
            Open Invitation
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
