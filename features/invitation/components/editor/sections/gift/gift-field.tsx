"use client";

import {
  useGiftTransferUpdate,
  useGiftPackageUpdate,
} from "@/features/invitation/hooks/editor-sections/use-gift-update";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EditorField, EditorInput, EditorLabel } from "../../editor-field";
import { Switch } from "@/components/ui/switch";

export function GiftEnabledField() {
  const gifts = useInvitationStore((s) => s.gifts);
  const isEnabled = useInvitationStore((s) => s.gifts.enabled);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField className="flex-row">
      <EditorLabel htmlFor="is-gift-enabled">Tampilkan Hadiah</EditorLabel>
      <Switch
        id="gift-enabled"
        checked={isEnabled}
        onCheckedChange={() =>
          set({ gifts: { ...gifts, enabled: !isEnabled } })
        }
      />
    </EditorField>
  );
}

// --- Bank Transfer Fields ---

export function GiftProviderField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.gifts.transfers.find((t) => t.id === id)?.provider ?? "",
  );
  const update = useGiftTransferUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`gift-provider-${id}`}>
        Bank / Dompet Digital
      </EditorLabel>
      <EditorInput
        id={`gift-provider-${id}`}
        autoComplete="off"
        placeholder="Bank Mandiri, BCA, GoPay, dll."
        value={value}
        onChange={(e) => update({ provider: e.target.value })}
      />
    </EditorField>
  );
}

export function GiftAccountNameField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.gifts.transfers.find((t) => t.id === id)?.accountName ?? "",
  );
  const update = useGiftTransferUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`gift-accountName-${id}`}>Atas Nama</EditorLabel>
      <EditorInput
        id={`gift-accountName-${id}`}
        autoComplete="off"
        placeholder="Rama Prasetyo"
        value={value}
        onChange={(e) => update({ accountName: e.target.value })}
      />
    </EditorField>
  );
}

export function GiftAccountNumberField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.gifts.transfers.find((t) => t.id === id)?.accountNumber ?? "",
  );
  const update = useGiftTransferUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`gift-accountNumber-${id}`}>
        No. Rekening / No. HP
      </EditorLabel>
      <EditorInput
        id={`gift-accountNumber-${id}`}
        autoComplete="off"
        placeholder="1234567890"
        value={value}
        onChange={(e) => update({ accountNumber: e.target.value })}
      />
    </EditorField>
  );
}

// --- Gift Package Fields ---

export function GiftPackageRecipientNameField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.gifts.packages.find((p) => p.id === id)?.recipientName ?? "",
  );
  const update = useGiftPackageUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`gift-recipientName-${id}`}>
        Nama Penerima
      </EditorLabel>
      <EditorInput
        id={`gift-recipientName-${id}`}
        autoComplete="off"
        placeholder="Rama Prasetyo"
        value={value}
        onChange={(e) => update({ recipientName: e.target.value })}
      />
    </EditorField>
  );
}

export function GiftPackageRecipientPhoneNumberField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) =>
      s.gifts.packages.find((p) => p.id === id)?.recipientPhoneNumber ?? "",
  );
  const update = useGiftPackageUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`gift-recipientPhoneNumber-${id}`}>
        No. HP Penerima
      </EditorLabel>
      <EditorInput
        id={`gift-recipientPhoneNumber-${id}`}
        autoComplete="off"
        placeholder="08123456789"
        value={value}
        onChange={(e) => update({ recipientPhoneNumber: e.target.value })}
      />
    </EditorField>
  );
}

export function GiftPackageAddressField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.gifts.packages.find((p) => p.id === id)?.address ?? "",
  );
  const update = useGiftPackageUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`gift-address-${id}`}>
        Alamat Pengiriman
      </EditorLabel>
      <EditorInput
        id={`gift-address-${id}`}
        autoComplete="off"
        placeholder="Jl. Mawar No. 12, Jakarta Selatan"
        value={value}
        onChange={(e) => update({ address: e.target.value })}
      />
    </EditorField>
  );
}
