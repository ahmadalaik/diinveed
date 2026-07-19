"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { formatDate } from "@/features/invitation/lib/datetime";
import { InvitationState } from "@/features/invitation/types/invitation.type";

interface Props {
  inv: InvitationState;
}

export function FooterAgnimaya({ inv }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer className="bg-(--tpl-bg-secondary) text-(--tpl-text-primary)/80 px-8 py-16 text-center border-t border-white/5">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <h3 className="text-3xl font-(family-name:--tpl-font-heading) text-(--tpl-text-primary) mb-2 font-light">
          {inv.brideNickname} <span className="text-(--tpl-text-tertiary)">|</span>{" "}
          {inv.groomNickname}
        </h3>
        <p className="text-[10px] font-(family-name:--tpl-font-body) uppercase tracking-[0.2em] text-(--tpl-text-secondary) mb-6">
          {formatDate(inv.events[0]?.date, "PP")}
        </p>
        <p className="text-[10px] font-(family-name:--tpl-font-body) uppercase tracking-wider opacity-40">
          &copy; 2026 Diinveed. Designed with Love.
        </p>
      </motion.div>
    </footer>
  );
}
