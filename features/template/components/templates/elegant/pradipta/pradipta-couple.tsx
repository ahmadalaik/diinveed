"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  inv: InvitationState;
}

interface CoupleBlockProps {
  type: "bride" | "groom";
  image?: string | null;
  name: string;
  label: string;
  description?: string | null;
  delay: number;
}

function CoupleBlock({
  type,
  image,
  name,
  label,
  description,
  delay,
}: CoupleBlockProps) {
  return (
    <motion.div
      key={type}
      className="flex flex-col items-center text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-150px" }}
      variants={fadeUp(delay)}
    >
      {image && (
        <div
          className={cn(
            "w-32 h-32 mb-4 rounded-full overflow-hidden border p-1",
            "border-(--tpl-text-tertiary)",
          )}
        >
          <Image
            width={200}
            height={200}
            src={image}
            alt={type === "bride" ? "Bride" : "Groom"}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      )}
      <h3
        className={cn(
          "text-3xl tracking-wide",
          "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
        )}
      >
        {name}
      </h3>
      <p
        className={cn(
          "text-[10px] uppercase tracking-widest mt-1 mb-2",
          "font-(family-name:--tpl-font-body) text-(--tpl-text-tertiary) [text-transform:var(--tpl-transform-body)]",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "font-normal text-balance text-xs italic",
          "font-(family-name:--tpl-font-body) text-(--tpl-text-primary)/80 [text-transform:var(--tpl-transform-body)]",
        )}
      >
        {description}
      </p>
    </motion.div>
  );
}

export function PradiptaCouple({ inv }: Props) {
  const brideBlock = (
    <CoupleBlock
      key="bride"
      type="bride"
      image={inv.brideImage}
      name={inv.brideName}
      label="Mempelai Wanita"
      description={inv.brideDescription}
      delay={inv.isBrideFirst ? 0.2 : 0.55}
    />
  );

  const groomBlock = (
    <CoupleBlock
      key="groom"
      type="groom"
      image={inv.groomImage}
      name={inv.groomName}
      label="Mempelai Pria"
      description={inv.groomDescription}
      delay={inv.isBrideFirst ? 0.55 : 0.2}
    />
  );

  const dividerBlock = (
    <motion.div
      key="divider"
      className={cn(
        "text-center text-2xl italic",
        "font-(family-name:--tpl-font-heading) text-(--tpl-text-tertiary)",
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-150px" }}
      variants={fadeIn(0.45)}
    >
      &amp;
    </motion.div>
  );

  return (
    <section className={cn("px-8 py-24", "bg-(--tpl-bg-primary)")}>
      <motion.div
        className="text-center mb-18"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp(0)}
      >
        <h2
          className={cn(
            "font-normal text-4xl tracking-wider",
            "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
          )}
        >
          Meet the Couple
        </h2>
      </motion.div>

      <div className="space-y-12">
        {inv.isBrideFirst
          ? [brideBlock, dividerBlock, groomBlock]
          : [groomBlock, dividerBlock, brideBlock]}
      </div>
    </section>
  );
}
