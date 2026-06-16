"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { arrayMove } from "@dnd-kit/sortable";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EditorError } from "../../editor-field";
import { EventCard } from "./event-card";

export function EventsSection() {
  const ids = useInvitationStore(useShallow((s) => s.events.map((e) => e.id)));
  const errors = useInvitationStore((s) => s.publishErrors?.events);
  const set = useInvitationStore((s) => s.set);

  const MAX_EVENT = 3;

  const add = () => {
    const events = useInvitationStore.getState().events;
    if (events.length >= MAX_EVENT) return;

    set({
      events: [
        ...events,
        {
          id: crypto.randomUUID(),
          date: "",
          timeStart: "",
          timeEnd: "",
          timezone: "WIB",
          title: "",
          description: "",
          locationName: "",
          mapsUrl: "",
        },
      ],
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const events = useInvitationStore.getState().events;
    const target = index + direction;
    if (target < 0 || target >= events.length) return;
    set({ events: arrayMove(events, index, target) });
  };

  return (
    <div className="space-y-3">
      <EditorError errors={errors} />
      {ids.map((id, index) => (
        <EventCard
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
        className="w-full flex items-center justify-center gap-1 border-2 border-dashed text-muted-foreground shadow-none hover:cursor-pointer"
        disabled={ids.length >= MAX_EVENT}
        onClick={add}
      >
        <Plus className="size-4" />
        <span className="text-[12px]">Tambah Sesi</span>
      </Button>
    </div>
  );
}
