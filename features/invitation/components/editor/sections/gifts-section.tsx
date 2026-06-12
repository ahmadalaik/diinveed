"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { GiftItem } from "@/features/invitation/types/invitation.type";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useShallow } from "zustand/shallow";
import {
  EditorError,
  EditorField,
  EditorInput,
  EditorLabel,
} from "../editor-field";
import { useGiftUpdate } from "@/features/invitation/hooks/editor-sections/use-gift-update";
import { FieldGroup } from "@/components/ui/field";

function GiftProviderField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => (s.gifts as GiftItem[]).find((e) => e.id === id)?.provider ?? "",
  );
  const update = useGiftUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`gift-provider-${id}`}>Provider</EditorLabel>
      <EditorInput
        id={`gift-provider-${id}`}
        autoComplete="off"
        placeholder="Bank Mandiri"
        value={value}
        onChange={(e) => update({ provider: e.target.value })}
      />
    </EditorField>
  );
}

function GiftAccountNameField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => (s.gifts as GiftItem[]).find((e) => e.id === id)?.accountName ?? "",
  );
  const update = useGiftUpdate(id);

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

function GiftAccountNumberField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) =>
      (s.gifts as GiftItem[]).find((e) => e.id === id)?.accountNumber ?? "",
  );
  const update = useGiftUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`gift-accountNumber-${id}`}>
        No. Rekening
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

interface GiftCardProps {
  id: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function GiftCard({ id, index, total, onMoveUp, onMoveDown }: GiftCardProps) {
  const set = useInvitationStore((s) => s.set);

  const remove = () => {
    const gifts = useInvitationStore.getState().gifts;
    set({ gifts: gifts.filter((g) => g.id !== id) });
  };

  return (
    <div className="space-y-2 border rounded-lg p-3 bg-card overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Hadiah {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 hover:cursor-pointer disabled:opacity-30"
              disabled={index === 0}
              onClick={onMoveUp}
              aria-label="Pindah ke atas"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 hover:cursor-pointer disabled:opacity-30"
              disabled={index === total - 1}
              onClick={onMoveDown}
              aria-label="Pindah ke bawah"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 hover:bg-destructive/10 hover:cursor-pointer"
            onClick={remove}
            aria-label="Hapus gift"
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </div>
      <FieldGroup>
        <GiftProviderField id={id} />
        <GiftAccountNameField id={id} />
        <GiftAccountNumberField id={id} />
      </FieldGroup>
    </div>
  );
}

export function GiftsSection() {
  const ids = useInvitationStore(useShallow((s) => s.gifts.map((g) => g.id)));
  const errors = useInvitationStore((s) => s.publishErrors?.gifts);
  const set = useInvitationStore((s) => s.set);

  const add = () => {
    const gifts = useInvitationStore.getState().gifts;
    set({
      gifts: [
        ...gifts,
        {
          id: crypto.randomUUID(),
          provider: "",
          accountName: "",
          accountNumber: "",
        },
      ],
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const gifts = useInvitationStore.getState().gifts;
    const target = index + direction;
    if (target < 0 || target >= gifts.length) return;
    set({ gifts: arrayMove(gifts, index, target) });
  };

  return (
    <div className="space-y-3">
      <EditorError errors={errors} />
      {ids.map((id, index) => (
        <GiftCard
          key={id}
          id={id}
          index={index}
          total={ids.length}
          onMoveUp={() => move(index, -1)}
          onMoveDown={() => move(index, 1)}
        />
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-full border-2 border-dashed shadow-none hover:cursor-pointer"
        onClick={add}
      >
        <Plus className="h-4 w-4 mr-1" /> Add Gift
      </Button>
    </div>
  );
}
