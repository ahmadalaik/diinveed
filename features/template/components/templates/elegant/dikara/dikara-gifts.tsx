"use client";

import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion, useInView } from "motion/react";
import { Wallet, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import CopyButton from "../../shared/copy-button";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay,
    },
  },
});

function GiftCard({
  delay,
  inView,
  children,
  className,
}: {
  delay: number;
  inView: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("rounded-xl text-center border border-(--tpl-text-primary)/50 p-6", className)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp(delay)}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  inv: InvitationState;
}

export function DikaraGifts({ inv }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      className={cn("relative min-h-dvh px-8 py-24 snap-start")}
      style={{ clipPath: "inset(0)" }}
    >
      <div className="absolute inset-0 bg-black/15 -z-10" />
      <div className="relative z-10">
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.15)}
        >
          <h2
            className={cn(
              "font-medium text-4xl tracking-wider mb-1",
              "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
            )}
          >
            Gifts
          </h2>
          <p
            className={cn(
              "mt-3 px-4 text-xs font-light leading-relaxed",
              "font-(family-name:--tpl-font-body) text-(--tpl-text-primary)/80",
            )}
          >
            Kehadiran dan doa Anda sangat berarti bagi kami. Tanda kasih yang
            diberikan pun kami terima dengan penuh syukur.
          </p>
        </motion.div>

        <div className="space-y-6">
          {(inv.gifts.transfers || []).map((gift, index) => (
            <GiftCard
              key={gift.id}
              delay={0.35 + index * 0.2}
              inView={isInView}
            >
              <h4
                className={cn(
                  "text-lg mb-6 flex items-center gap-3 font-medium",
                  "font-(family-name:--tpl-font-body) text-(--tpl-text-primary)",
                )}
              >
                <Wallet
                  strokeWidth={1.5}
                  className="text-(--tpl-text-primary)/80"
                />
                {gift.provider}
              </h4>
              <div className="space-y-3 text-sm tracking-wide text-(--tpl-text-primary)">
                <div className="flex flex-col items-start">
                  <span
                    className={cn("font-normal", "text-(--tpl-text-tertiary)")}
                  >
                    Account Name
                  </span>
                  <span className="font-medium">{gift.accountName}</span>
                </div>
                <div className="h-px bg-(--tpl-text-primary)/20" />
                <div className="flex flex-col items-start mb-2">
                  <span
                    className={cn("font-normal", "text-(--tpl-text-tertiary)")}
                  >
                    Account Number
                  </span>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{gift.accountNumber}</span>
                    <CopyButton
                      className={cn(
                        "transition-all duration-500 tracking-wider text-xs uppercase rounded-sm shadow-sm font-medium py-1.5",
                        "bg-white text-(--tpl-text-secondary) hover:bg-(--tpl-btn-bg-primary) hover:text-(--tpl-text-primary)",
                      )}
                      value={gift.accountNumber}
                    />
                  </div>
                </div>
              </div>
            </GiftCard>
          ))}

          {(inv.gifts.packages || []).map((pkg, index) => (
            <GiftCard
              key={pkg.id}
              delay={0.35 + ((inv.gifts.transfers || []).length + index) * 0.2}
              inView={isInView}
              className="pt-6"
            >
              <h4
                className={cn(
                  "text-lg mb-6 flex items-center gap-3 font-medium",
                  "font-(family-name:--tpl-font-body) text-(--tpl-text-primary)",
                )}
              >
                <Gift
                  strokeWidth={1.5}
                  className="text-(--tpl-text-primary)/80"
                />
                Kirim Kado
              </h4>
              <div className="space-y-3 text-sm tracking-wide text-(--tpl-text-primary)">
                <div className="flex flex-col items-start">
                  <span
                    className={cn("font-normal", "text-(--tpl-text-tertiary)")}
                  >
                    Penerima
                  </span>
                  <span className="font-medium">
                    {pkg.recipientName} ({pkg.recipientPhoneNumber})
                  </span>
                </div>
                <div className="h-px bg-(--tpl-text-primary)/20" />
                <div className="flex flex-col items-start mb-2">
                  <span
                    className={cn("font-normal", "text-(--tpl-text-tertiary)")}
                  >
                    Alamat Pengiriman
                  </span>
                  <div className="flex items-start justify-between w-full gap-4">
                    <span className="font-medium text-left w-[18ch]">{pkg.address}</span>
                    <CopyButton
                      className={cn(
                        "transition-all duration-500 tracking-wider text-xs uppercase rounded-sm shadow-sm font-medium shrink-0 py-1.5",
                        "bg-white text-(--tpl-text-secondary) hover:bg-(--tpl-btn-bg-primary) hover:text-(--tpl-text-primary)",
                      )}
                      value={pkg.address}
                    />
                  </div>
                </div>
              </div>
            </GiftCard>
          ))}
        </div>
      </div>
    </section>
  );
}
