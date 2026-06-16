"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { EventDateField, EventDescField, EventLocationField, EventTimeField, EventTitleField } from "./event-field";

interface EventCardProps {
  id: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function EventCard({
  id,
  index,
  total,
  onMoveUp,
  onMoveDown,
}: EventCardProps) {
  const set = useInvitationStore((s) => s.set);
  const remove = () => {
    const events = useInvitationStore.getState().events;
    set({ events: events.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-2 border rounded-lg p-3 bg-card overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          Sesi {index + 1}
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
            aria-label="Hapus event"
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </div>
      <FieldGroup className="gap-3">
        <EventTitleField id={id} />
        <EventDateField id={id} />
        <EventTimeField id={id} />
        <EventDescField id={id} />
        <EventLocationField id={id} />
      </FieldGroup>
    </div>
  );
}
