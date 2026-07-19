"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  inv: InvitationState;
}

function CoupleSection({
  inv,
  person,
}: {
  inv: InvitationState;
  person: "bride" | "groom";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const isBride = person === "bride";
  const image = isBride ? inv.brideImage : inv.groomImage;

  return (
    <section
      ref={sectionRef}
      className="relative px-8 min-h-dvh flex flex-col justify-end pb-[20vh] snap-start snap-always overflow-hidden"
    >
      {image && (
        <>
          <Image
            src={image}
            alt={`${isBride ? "Bride" : "Groom"} Background`}
            fill
            sizes="100vw"
            quality={100}
            className="object-cover -z-20"
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/10 to-black/60 -z-10" />
        </>
      )}

      <div className="relative z-10 w-full">
        <motion.div
          className="flex flex-col gap-0.5 items-start max-w-sm"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.2)}
        >
          <p
            className={cn(
              "text-sm uppercase tracking-widest",
              "font-(family-name:--tpl-font-body) text-(--tpl-text-tertiary) [text-transform:var(--tpl-transform-body)]",
            )}
          >
            {isBride ? "The Bride" : "The Groom"}
          </p>

          <h3
            className={cn(
              "text-4xl tracking-wide pt-2",
              "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
            )}
          >
            {isBride ? inv.brideName : inv.groomName}
          </h3>

          <p
            className={cn(
              "font-normal text-balance text-xs italic leading-relaxed",
              "font-(family-name:--tpl-font-body) text-(--tpl-text-primary)/80 [text-transform:var(--tpl-transform-body)]",
            )}
          >
            {isBride ? inv.brideDescription : inv.groomDescription}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function DikaraCouple({ inv }: Props) {
  return (
    <>
      <CoupleSection
        key={inv.isBrideFirst ? "bride" : "groom"}
        inv={inv}
        person={inv.isBrideFirst ? "bride" : "groom"}
      />
      <CoupleSection
        key={inv.isBrideFirst ? "groom" : "bride"}
        inv={inv}
        person={inv.isBrideFirst ? "groom" : "bride"}
      />
    </>
  );
}
