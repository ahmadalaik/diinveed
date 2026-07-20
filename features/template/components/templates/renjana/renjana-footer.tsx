"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface Props {
  inv: InvitationState;
}

export function FooterRenjana({ inv }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer className="bg-[#fbf0ef] px-8 py-16 text-center border-t border-[#c98a96]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {inv.isBrideFirst ? (
          <div className="flex justify-center gap-3 font-(family-name:--font-script) text-3xl text-[#c98a96] mb-4">
            <p>{inv.brideNickname?.charAt(0) || "C"}</p>
            <span className="text-2xl">&amp;</span>
            <p>{inv.groomNickname?.charAt(0) || "G"}</p>
          </div>
        ) : (
          <div className="flex justify-center gap-3 font-(family-name:--font-script) text-3xl text-[#c98a96] mb-4">
            <p>{inv.groomNickname?.charAt(0) || "C"}</p>
            <span className="text-2xl">&amp;</span>
            <p>{inv.brideNickname?.charAt(0) || "G"}</p>
          </div>
        )}
        <div className="mb-4">
          <a
            href="#"
            className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest"
          >
            Instagram
          </a>
        </div>
        <p className="text-[10px] text-stone-400 uppercase tracking-widest">
          &copy; 2026 Diinveed. Design with love
        </p>
      </motion.div>
    </footer>
  );
}
