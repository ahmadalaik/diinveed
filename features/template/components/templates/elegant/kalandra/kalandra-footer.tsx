"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
  inv: InvitationState;
}

export function KalandraFooter({ inv }: Props) {
  return (
    <footer className="px-8 py-16 text-center bg-(--tpl-bg-secondary)">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className={cn(
            "flex justify-center items-center gap-3 text-3xl mb-4",
            "font-(family-name:--tpl-font-heading) text-(--tpl-text-secondary)",
          )}
        >
          <p>
            {inv.isBrideFirst
              ? inv.brideNickname?.charAt(0)
              : inv.groomNickname?.charAt(0) || "C"}
          </p>
          <span className="text-2xl">&amp;</span>
          <p>
            {inv.isBrideFirst
              ? inv.groomNickname?.charAt(0)
              : inv.brideNickname?.charAt(0) || "G"}
          </p>
        </div>
        <div className="mb-4">
          <a
            href="#"
            className={cn(
              "text-[10px] transition-colors uppercase tracking-widest",
              "text-(--tpl-text-tertiary) hover:text-(--tpl-text-tertiary)/80",
            )}
          >
            Instagram
          </a>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-(--tpl-text-tertiary)">
          &copy; 2026 Diinveed. Design with love
        </p>
      </motion.div>
    </footer>
  );
}
