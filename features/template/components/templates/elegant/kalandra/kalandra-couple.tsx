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

interface PersonBlockProps {
  role: "bride" | "groom";
  name: string;
  image?: string | null;
  label: string;
  description?: string | null;
  delay: number;
}

function KalandraPersonBlock({
  role,
  name,
  image,
  label,
  description,
  delay,
}: PersonBlockProps) {
  return (
    <motion.div
      key={role}
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
            "border-(--tpl-text-primary)",
          )}
        >
          <Image
            width={200}
            height={200}
            src={image}
            alt={role === "bride" ? "Bride" : "Groom"}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      )}
      <h3
        className={cn(
          "text-3xl tracking-wide",
          "font-(family-name:--tpl-font-heading) text-(--tpl-text-secondary)",
        )}
      >
        {name}
      </h3>
      <p
        className={cn(
          "text-[10px] uppercase tracking-widest mt-1 mb-2",
          "font-(family-name:--tpl-font-body) text-(--tpl-text-secondary) [text-transform:var(--tpl-transform-body)]",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "font-normal text-balance text-xs italic",
          "font-(family-name:--tpl-font-body) text-(--tpl-text-tertiary) [text-transform:var(--tpl-transform-body)]",
        )}
      >
        {description}
      </p>
    </motion.div>
  );
}

interface Props {
  inv: InvitationState;
}

export function KalandraCouple({ inv }: Props) {
  const brideBlock = (
    <KalandraPersonBlock
      key="bride"
      role="bride"
      name={inv.brideName}
      image={inv.brideImage}
      label="Mempelai Wanita"
      description={inv.brideDescription}
      delay={inv.isBrideFirst ? 0.2 : 0.55}
    />
  );

  const groomBlock = (
    <KalandraPersonBlock
      key="groom"
      role="groom"
      name={inv.groomName}
      image={inv.groomImage}
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
        "font-(family-name:--tpl-font-heading) text-(--tpl-text-secondary)",
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
    <section className="px-8 py-24 bg-(--tpl-bg-primary)">
      <motion.div
        className="text-center mb-18"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp(0)}
      >
        <h2 className=" font-(family-name:--tpl-font-heading) font-normal text-4xl tracking-wider text-(--tpl-text-secondary)">
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
