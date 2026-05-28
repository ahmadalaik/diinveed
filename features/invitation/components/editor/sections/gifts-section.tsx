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

export function GiftsSection() {
  const gifts = useInvitationStore((s) => s.gifts as GiftItem[]);
  const set = useInvitationStore((s) => s.set);
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
      gifts: [...gifts, { id: crypto.randomUUID(), name: "", description: "" }],
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
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={gift.name}
                    onChange={(e) => update(gift.id, { name: e.target.value })}
                    placeholder="KitchenAid Mixer"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={gift.description}
                    onChange={(e) =>
                      update(gift.id, { description: e.target.value })
                    }
                    placeholder="Optional"
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
