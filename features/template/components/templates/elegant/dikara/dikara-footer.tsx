"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef } from "react";

interface Props {
  inv: InvitationState;
}

export function DikaraFooter({ inv }: Props) {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.3 });

  return (
    <footer
      ref={footerRef}
      className={cn(
        "relative min-h-dvh flex flex-col px-8 py-14 text-center overflow-hidden snap-start",
      )}
    >
      <div className="absolute inset-0 bg-black/45 -z-10" />
      {inv?.coverMobileImage && (
        <Image
          src={inv.coverMobileImage}
          alt="Footer Background"
          fill
          sizes="100vw"
          quality={80}
          className="object-cover -z-20"
        />
      )}

      <motion.div
        className="relative z-10 w-full flex-1 flex flex-col justify-between items-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
      >
        <div className="flex flex-col items-center gap-4 mt-8">
          <p
            className={cn(
              "text-xs font-light leading-relaxed text-balance",
              "font-(family-name:--tpl-font-body) text-(--tpl-text-primary)/90",
            )}
          >
            Kami tidak sabar untuk berbagi momen istimewa ini bersama Anda.
            Kehadiran Anda akan membuat hari kami semakin bermakna.
          </p>
          <div
            className={cn(
              "flex justify-center items-center gap-3 text-4xl",
              "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
            )}
          >
            <p>{inv.isBrideFirst ? inv.brideNickname : inv.groomNickname}</p>
            <span className="text-3xl">&amp;</span>
            <p>{inv.isBrideFirst ? inv.groomNickname : inv.brideNickname}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <a
            href="#"
            className={cn(
              "text-[10px] transition-colors uppercase tracking-widest",
              "text-(--tpl-text-primary) hover:text-(--tpl-text-tertiary)",
            )}
          >
            Instagram
          </a>
          <p className="text-[10px] uppercase tracking-widest text-(--tpl-text-primary)/80">
            &copy; 2026 Onestoria. Design with love
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
