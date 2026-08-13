"use client";

import { AtSign, Globe2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { getCoupleNames } from "./ourify-data";
import { OurifyReveal } from "./ourify-motion";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

function OurifyFooterWaveform() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <span
      role="img"
      aria-label="Ourify waveform"
      className="flex h-7 items-end justify-center gap-1"
    >
      {[18, 18, 8].map((height, index) => (
        <motion.span
          key={index}
          data-footer-wave-bar
          className="w-[3px] rounded-full bg-(--tpl-text-tertiary)"
          initial={{ height }}
          animate={
            shouldReduceMotion
              ? { height }
              : { height: [height, Math.max(8, 28 - height), height] }
          }
          transition={{
            duration: 0.8 + index * 0.08,
            repeat: shouldReduceMotion ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function OurifyFooter({ invitation }: { invitation: InvitationState }) {
  return (
    <footer data-ourify-section="footer" className="pb-32 text-center">
      <div
        data-testid="ourify-footer-closing"
        className="bg-[linear-gradient(180deg,#103c25_0%,#0b2216_56%,#121212_100%)] px-5 py-16"
      >
        <OurifyReveal className="flex flex-col items-center">
          <OurifyFooterWaveform />
          <p className="mt-6 text-[10px] font-extrabold tracking-[0.16em] text-[#b3b3b3]">
            THANKS FOR LISTENING,
          </p>
          <p className="mt-3 text-[28px] leading-tight font-black tracking-[-0.04em] text-white">
            {getCoupleNames(invitation)}
          </p>
          <p className="mt-4 max-w-[285px] text-[12px] leading-5 text-[#b3b3b3]">
            {OURIFY_REVIEW_PLACEHOLDERS.closingCopy}
          </p>
        </OurifyReveal>
      </div>

      <OurifyReveal className="flex flex-col items-center px-5 pt-10">
        <p className="text-[24px] font-black tracking-[-0.05em] text-white">
          Ourify
        </p>
        <p className="mt-3 text-[10px] leading-4 text-[#8f8f8f]">
          © 2026 Onestoria. Made for stories worth replaying.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Button
            asChild
            variant="secondary"
            size="icon"
            className="rounded-full bg-[#222222] text-white hover:bg-[#2a2a2a] hover:text-white"
          >
            <a
              href={OURIFY_REVIEW_PLACEHOLDERS.footerLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ourify Instagram"
            >
              <AtSign />
            </a>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="icon"
            className="rounded-full bg-[#222222] text-white hover:bg-[#2a2a2a] hover:text-white"
          >
            <a
              href={OURIFY_REVIEW_PLACEHOLDERS.footerLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ourify website"
            >
              <Globe2 />
            </a>
          </Button>
        </div>
      </OurifyReveal>
    </footer>
  );
}
