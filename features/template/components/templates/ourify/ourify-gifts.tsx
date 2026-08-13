"use client";

import { Gift, MapPin, WalletCards } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import CopyButton from "../shared/copy-button";
import {
  OURIFY_STANDARD_SECTION_CLASS,
  OurifySectionHeading,
} from "./ourify-motion";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

type GiftTab = "transfer" | "gifts";

function resolveProviderMark(provider: string) {
  const providerKey = provider.trim().toUpperCase();

  return (
    OURIFY_REVIEW_PLACEHOLDERS.providerMarks[providerKey] ??
    providerKey.slice(0, 10)
  );
}

export function OurifyGifts({ invitation }: { invitation: InvitationState }) {
  const [activeTab, setActiveTab] = useState<GiftTab>("transfer");

  if (!invitation.gifts.enabled) return null;

  const hasTransfers = invitation.gifts.transfers.length > 0;
  const hasPackages = invitation.gifts.packages.length > 0;

  if (!hasTransfers && !hasPackages) return null;

  const initialTab: GiftTab = hasTransfers ? "transfer" : "gifts";
  const selectedTab =
    activeTab === "transfer" && !hasTransfers
      ? initialTab
      : activeTab === "gifts" && !hasPackages
        ? initialTab
        : activeTab;

  return (
    <section
      data-ourify-section="gifts"
      aria-labelledby="ourify-gifts-title"
      className={OURIFY_STANDARD_SECTION_CLASS}
    >
      <OurifySectionHeading id="ourify-gifts-title" eyebrow="Merch">
        Wedding Gift
      </OurifySectionHeading>

      <div
        data-testid="ourify-gift-intro"
        className="mt-7 rounded-[10px] bg-[#222222] px-[18px] py-5"
      >
        <p className="text-[13px] leading-5 text-[#d8d8d8]">
          Kehadiran dan doa Anda adalah hadiah terindah bagi kami. Jika
          berkenan, tanda kasih dapat disampaikan melalui detail berikut.
        </p>
      </div>

      <div className="mt-5">
        <div
          role="tablist"
          aria-label="Pilihan wedding gift"
          className="grid h-10 w-full grid-cols-2 rounded-full bg-[#222222] p-1"
        >
          <Button
            type="button"
            role="tab"
            id="ourify-transfer-tab"
            aria-controls="ourify-transfer-panel"
            aria-selected={selectedTab === "transfer"}
            disabled={!hasTransfers}
            onClick={() => setActiveTab("transfer")}
            className="h-8 rounded-full bg-transparent text-[12px] font-bold text-[#b3b3b3] shadow-none hover:bg-white/5 aria-selected:bg-(--tpl-text-tertiary) aria-selected:text-[#121212]"
          >
            Transfer
          </Button>
          <Button
            type="button"
            role="tab"
            id="ourify-gifts-tab"
            aria-controls="ourify-gifts-panel"
            aria-selected={selectedTab === "gifts"}
            disabled={!hasPackages}
            onClick={() => setActiveTab("gifts")}
            className="h-8 rounded-full bg-transparent text-[12px] font-bold text-[#b3b3b3] shadow-none hover:bg-white/5 aria-selected:bg-(--tpl-text-tertiary) aria-selected:text-[#121212]"
          >
            Gifts
          </Button>
        </div>

        {selectedTab === "transfer" ? (
          <div
            role="tabpanel"
            id="ourify-transfer-panel"
            aria-labelledby="ourify-transfer-tab"
            className="mt-4 space-y-3"
          >
            {invitation.gifts.transfers.map((transfer) => (
              <Card
                key={transfer.id}
                className="gap-0 rounded-[10px] border-0 bg-[#222222] py-0 text-white shadow-none"
              >
                <CardContent className="p-[18px]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-flex min-h-8 items-center rounded-md bg-white px-3 text-[13px] font-black tracking-[-0.03em] text-[#121212]">
                        {resolveProviderMark(transfer.provider)}
                      </span>
                      <p className="mt-5 text-[11px] text-[#b3b3b3]">
                        Account holder
                      </p>
                      <p className="mt-1 truncate text-[13px] font-bold">
                        {transfer.accountName}
                      </p>
                    </div>
                    <WalletCards
                      aria-hidden="true"
                      className="size-5 shrink-0 text-(--tpl-text-tertiary)"
                    />
                  </div>
                  <p className="mt-5 font-mono text-[20px] font-bold tracking-[0.045em]">
                    {transfer.accountNumber}
                  </p>
                  <CopyButton
                    type="button"
                    value={transfer.accountNumber}
                    aria-label={`Salin nomor rekening ${transfer.provider}`}
                    className="mt-5 w-full rounded-full border border-white/45 bg-transparent py-2.5 text-[12px] font-bold text-white hover:bg-white/10"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {selectedTab === "gifts" ? (
          <div
            role="tabpanel"
            id="ourify-gifts-panel"
            aria-labelledby="ourify-gifts-tab"
            className="mt-4 space-y-3"
          >
            {invitation.gifts.packages.map((giftPackage) => (
              <Card
                key={giftPackage.id}
                className="gap-0 rounded-[10px] border-0 bg-[#222222] py-0 text-white shadow-none"
              >
                <CardContent className="p-[18px]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-[#b3b3b3]">
                        Send a gift to
                      </p>
                      <p className="mt-1 text-[15px] font-extrabold">
                        {giftPackage.recipientName}
                      </p>
                    </div>
                    <Gift
                      aria-hidden="true"
                      className="size-5 text-(--tpl-text-tertiary)"
                    />
                  </div>
                  <p className="mt-5 flex items-start gap-2 text-[13px] leading-5 text-[#d8d8d8]">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-(--tpl-text-tertiary)"
                    />
                    {giftPackage.address}
                  </p>
                  <p className="mt-3 text-[12px] text-[#b3b3b3]">
                    {giftPackage.recipientPhoneNumber}
                  </p>
                  <CopyButton
                    type="button"
                    value={giftPackage.address}
                    aria-label={`Salin alamat ${giftPackage.recipientName}`}
                    className="mt-5 w-full rounded-full border border-white/45 bg-transparent py-2.5 text-[12px] font-bold text-white hover:bg-white/10"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
