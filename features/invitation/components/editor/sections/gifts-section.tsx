"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { GiftItem } from "@/features/invitation/types/invitation.type";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../sortable-item";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useShallow } from "zustand/shallow";

export function GiftsSection() {
  const { gifts, set } = useInvitationStore(
    useShallow((s) => ({ gifts: s.gifts, set: s.set })),
  );
  const sensors = useSensors(useSensor(PointerSensor));

  const update = (id: string, patch: Partial<GiftItem>) => {
    set({
      gifts: gifts.map((gift) =>
        gift.id === id ? { ...gift, ...patch } : gift,
      ),
    });
  };

  const remove = (id: string) => {
    set({ gifts: gifts.filter((gift) => gift.id !== id) });
  };

  const add = () => {
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

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = gifts.findIndex((g) => g.id === active.id);
    const newIndex = gifts.findIndex((g) => g.id === over.id);
    set({ gifts: arrayMove(gifts, oldIndex, newIndex) });
  };

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={gifts.map((g) => g.id)}
          strategy={verticalListSortingStrategy}
        >
          {gifts.map((gift, i) => (
            <SortableItem key={gift.id} id={gift.id}>
              <div className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Gift {i + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => remove(gift.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div>
                  <Label className="text-xs">Nama Bank/E-Wallet</Label>
                  <Input
                    value={gift.provider}
                    onChange={(e) =>
                      update(gift.id, { provider: e.target.value })
                    }
                    placeholder="Bank BSI"
                  />
                </div>
                <div>
                  <Label className="text-xs">Atas Nama</Label>
                  <Input
                    value={gift.accountName}
                    onChange={(e) =>
                      update(gift.id, { accountName: e.target.value })
                    }
                    placeholder="Citra Maharani"
                  />
                </div>
                <div>
                  <Label className="text-xs">No. Rekening</Label>
                  <Input
                    value={gift.accountNumber}
                    onChange={(e) =>
                      update(gift.id, { accountNumber: e.target.value })
                    }
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" className="w-full" onClick={add}>
        <Plus className="h-4 w-4 mr-1" /> Add Gift
      </Button>
    </div>
  );
}
