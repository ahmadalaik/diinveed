"use client";

import {
  useInvitationStore,
  useInvitationStoreApi,
} from "@/features/invitation/store/invitation-store";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { EditorError } from "../../../editor-field";
import { GiftTransferCard, GiftPackageCard } from "./gift-card";
import { GiftEnabledField } from "./gift-field";

export function GiftsSection() {
  const store = useInvitationStoreApi();
  const transferIds = useInvitationStore(
    useShallow((s) => (s.gifts.transfers || []).map((t) => t.id)),
  );
  const packageIds = useInvitationStore(
    useShallow((s) => (s.gifts.packages || []).map((p) => p.id)),
  );
  const isEnabled = useInvitationStore((s) => s.gifts.enabled);
  const errors = useInvitationStore((s) => s.publishErrors?.gifts);
  const set = useInvitationStore((s) => s.set);

  const MAX_TRANSFER = 2;
  const MAX_GIFT = 1;

  const addTransfer = () => {
    const gifts = store.getState().gifts;
    const currentTransfers = gifts.transfers || [];
    if (currentTransfers.length >= MAX_TRANSFER) return;

    set({
      gifts: {
        ...gifts,
        transfers: [
          ...currentTransfers,
          {
            id: crypto.randomUUID(),
            provider: "",
            accountName: "",
            accountNumber: "",
          },
        ],
      },
    });
  };

  const addPackage = () => {
    const gifts = store.getState().gifts;
    const currentPackages = gifts.packages || [];
    if (currentPackages.length >= MAX_GIFT) return;

    set({
      gifts: {
        ...gifts,
        packages: [
          ...currentPackages,
          {
            id: crypto.randomUUID(),
            recipientName: "",
            recipientPhoneNumber: "",
            address: "",
          },
        ],
      },
    });
  };

  const moveTransfer = (index: number, direction: -1 | 1) => {
    const gifts = store.getState().gifts;
    const currentTransfers = gifts.transfers || [];
    const target = index + direction;
    if (target < 0 || target >= currentTransfers.length) return;
    set({
      gifts: {
        ...gifts,
        transfers: arrayMove(currentTransfers, index, target),
      },
    });
  };

  const movePackage = (index: number, direction: -1 | 1) => {
    const gifts = store.getState().gifts;
    const currentPackages = gifts.packages || [];
    const target = index + direction;
    if (target < 0 || target >= currentPackages.length) return;
    set({
      gifts: {
        ...gifts,
        packages: arrayMove(currentPackages, index, target),
      },
    });
  };

  if (!isEnabled) {
    return (
      <div className="space-y-3 py-4">
        <GiftEnabledField />
        <div className="flex flex-col justify-center items-center w-full h-20 rounded-md bg-muted text-muted-foreground text-xs">
          <span>Section hadiah tidak ditampilkan di undangan</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-publish-field="gifts"
      data-invalid={Boolean(errors?.length) || undefined}
      className="space-y-6"
    >
      <EditorError errors={errors} />
      <GiftEnabledField />

      {/* Bank/E-Wallet Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-1">
          <span className="text-xs font-medium text-foreground">
            Rekening Bank / E-Wallet
          </span>
          <span className="text-xs text-muted-foreground">
            Maksimal {MAX_TRANSFER}
          </span>
        </div>
        {transferIds.map((id, index) => (
          <GiftTransferCard
            key={id}
            id={id}
            index={index}
            total={transferIds.length}
            onMoveUp={() => moveTransfer(index, -1)}
            onMoveDown={() => moveTransfer(index, 1)}
          />
        ))}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-1 border-2 border-dashed text-muted-foreground shadow-none hover:cursor-pointer"
          disabled={transferIds.length >= MAX_TRANSFER}
          onClick={addTransfer}
        >
          <Plus className="size-4" />
          <span className="text-[12px]">Tambah Rekening</span>
        </Button>
      </div>

      {/* Package Address Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-1">
          <span className="text-xs font-medium text-foreground">
            Kirim Kado (Alamat Pengiriman)
          </span>
          <span className="text-xs text-muted-foreground">
            Maksimal {MAX_GIFT}
          </span>
        </div>
        {packageIds.map((id, index) => (
          <GiftPackageCard
            key={id}
            id={id}
            index={index}
            total={packageIds.length}
            onMoveUp={() => movePackage(index, -1)}
            onMoveDown={() => movePackage(index, 1)}
          />
        ))}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-1 border-2 border-dashed text-muted-foreground shadow-none hover:cursor-pointer"
          disabled={packageIds.length >= MAX_GIFT}
          onClick={addPackage}
        >
          <Plus className="size-4" />
          <span className="text-[12px]">Tambah Alamat Kado</span>
        </Button>
      </div>
    </div>
  );
}
