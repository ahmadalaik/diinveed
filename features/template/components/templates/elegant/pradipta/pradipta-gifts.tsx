"use client";

import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion } from "motion/react";
import { Wallet, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
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
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="p-5 rounded-xl text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-150px" }}
      variants={fadeUp(delay)}
    >
      {children}
    </motion.div>
  );
}

interface Props {
  inv: InvitationState;
}

export function PradiptaGifts({ inv }: Props) {
  return (
    <section className="px-8 py-16">
      <motion.div
        className="text-center mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp(0)}
      >
        <h2
          className={cn(
            "font-medium text-4xl tracking-wider",
            "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
          )}
        >
          Gifts
        </h2>
        <p
          className={cn(
            "mt-3 px-4 text-xs font-light leading-relaxed",
            "font-(family-name:--tpl-font-body) text-(--tpl-text-primary)",
          )}
        >
          Kehadiran dan doa Anda sangat berarti bagi kami. Tanda kasih yang
          diberikan pun kami terima dengan penuh syukur.
        </p>
      </motion.div>

      <div className="space-y-6">
        {(inv.gifts.transfers || []).map((gift, index) => (
          <GiftCard key={gift.id} delay={index * 0.15}>
            <h4
              className={cn(
                "text-lg mb-6 flex items-center gap-3 font-medium",
                "font-(family-name:--tpl-font-body) text-(--tpl-text-primary)",
              )}
            >
              <Wallet strokeWidth={1.5} className="text-(--tpl-text-primary)" />
              {gift.provider}
            </h4>
            <div
              className={cn(
                "space-y-3 text-sm tracking-wide",
                "text-(--tpl-text-primary)",
              )}
            >
              <div className="flex flex-col items-start">
                <span className="font-light">Atas Nama</span>
                <span className="font-medium">{gift.accountName}</span>
              </div>
              <div className="h-px bg-(--tpl-bg-tertiary)" />
              <div className="flex flex-col items-start mb-2">
                <span className="font-light">No. Rekening/Telepon</span>
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{gift.accountNumber}</span>
                  <CopyButton
                    className={cn(
                      "bg-stone-50 hover:text-stone-50 transition-all duration-500 tracking-wider text-xs uppercase rounded-sm shadow-sm font-medium",
                      "hover:bg-(--tpl-bg-tertiary) text-(--tpl-text-primary)",
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
            delay={((inv.gifts.transfers || []).length + index) * 0.15}
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
            <div
              className={cn(
                "space-y-3 text-sm tracking-wide",
                "text-(--tpl-text-primary)",
              )}
            >
              <div className="flex flex-col items-start">
                <span className="font-light">Penerima</span>
                <span className="font-medium">
                  {pkg.recipientName} ({pkg.recipientPhoneNumber})
                </span>
              </div>
              <div className="h-px bg-(--tpl-bg-tertiary) " />
              <div className="flex flex-col items-start mb-2">
                <span className="font-light">Alamat Pengiriman</span>
                <div className="flex items-start justify-between w-full gap-4">
                  <span className="font-medium text-left">{pkg.address}</span>
                  <CopyButton
                    className={cn(
                      "bg-stone-50 hover:text-stone-50 transition-all duration-500 tracking-wider text-xs uppercase rounded-sm shadow-sm font-medium shrink-0",
                      "hover:bg-(--tpl-bg-tertiary) text-(--tpl-text-primary)",
                    )}
                    value={pkg.address}
                  />
                </div>
              </div>
            </div>
          </GiftCard>
        ))}
      </div>
    </section>
  );
}
