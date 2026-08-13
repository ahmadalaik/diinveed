"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/features/invitation/lib/datetime";
import { resolveCountdownEvent } from "@/features/invitation/lib/countdown-event";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  inv: InvitationState;
  onOpen: (open: boolean) => void;
  guestName?: string;
}

export function DikaraCover({ inv, onOpen, guestName }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const countdownEvent = resolveCountdownEvent(inv.events, inv.countdownEventId);

  const handleOpen = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpen(true);
    }, 800);
  };

  return (
    <section
      className={cn(
        "fixed right-0 top-0 z-50 transition-transform duration-1000 ease-in-out w-full lg:w-[35%] min-h-dvh flex flex-col px-8 py-14 text-center bg-stone-900",
        // "bg-(--tpl-bg-secondary)", // uncomment this for apply overlay blend feature
        isClosing ? "-translate-y-full" : "translate-y-0",
      )}
    >
      {inv.coverMobileImage && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-5000 ease-in-out overflow-hidden",
            // "opacity-100 mix-blend-luminosity", // uncomment this for apply overlay blend feature
          )}
        >
          <Image
            src={inv.coverMobileImage}
            alt="Thumbnail"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 25vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/40" />
        </div>
      )}

      <motion.div
        className="flex flex-col justify-between flex-1 w-full relative z-10 py-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.3, delayChildren: 0.4 } },
        }}
      >
        <div className="flex flex-col items-center">
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
            <p
              className={cn(
                "text-xs font-light tracking-[0.24em] drop-shadow-md",
                "text-(--tpl-text-primary)",
                "[text-transform:var(--tpl-transform-body)]",
              )}
            >
              The Wedding of
            </p>
          </motion.div>

          <motion.h1
            className={cn(
              "leading-none capitalize text-5xl drop-shadow-lg mt-4",
              "text-(--tpl-text-primary)",
              "font-(family-name:--tpl-font-heading)",
            )}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
          >
            {inv.isBrideFirst ? inv.brideNickname : inv.groomNickname}{" "}
            <span className="text-3xl opacity-80 mx-2">&amp;</span>{" "}
            {inv.isBrideFirst ? inv.groomNickname : inv.brideNickname}
          </motion.h1>

          {inv.events?.[0]?.date && (
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
              <p
                className={cn(
                  "font-light tracking-[0.24em] text-xs drop-shadow-md mt-3",
                  "text-(--tpl-text-primary)",
                  "[text-transform:var(--tpl-transform-body)]",
                )}
              >
                {countdownEvent ? formatDate(countdownEvent.date, "PPPP") : "Tanggal akan diumumkan"}
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col items-center gap-7">
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
            <div className="flex flex-col justify-center">
              <p
                className={cn(
                  "font-light text-xs tracking-[0.42em] drop-shadow-md",
                  "text-(--tpl-text-primary)",
                  // "font-(family-name:--tpl-font-serif)",
                  "[text-transform:var(--tpl-transform-body)]",
                )}
              >
                Kepada Yth.
              </p>
              <span
                className={cn(
                  "font-(family-name:--tpl-font-heading) font-medium text-2xl italic mt-2 drop-shadow-md text-balance",
                  "text-(--tpl-text-primary)",
                )}
              >
                {guestName ?? "Tamu Undangan"}
              </span>
            </div>
          </motion.div>

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
            <Button
              variant="outline"
              size="lg"
              type="button"
              className={cn(
                "bg-transparent gap-3 py-3 px-6 rounded-sm text-[10px] tracking-[0.24em] transition-colors duration-300 cursor-pointer drop-shadow-md",
                "text-(--tpl-text-primary)",
                "border-(--tpl-bg-secondary)",
                "[text-transform:var(--tpl-transform-body)]",
              )}
              onClick={handleOpen}
            >
              <Mail strokeWidth={1.5} className="size-4" />
              Buka Undangan
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
