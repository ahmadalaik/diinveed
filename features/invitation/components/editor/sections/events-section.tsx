"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EventItem } from "@/features/invitation/types/invitation.type";
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

export function EventsSection() {
  const events = useInvitationStore((s) => s.events as EventItem[]);
  const set = useInvitationStore((s) => s.set);
  const sensors = useSensors(useSensor(PointerSensor));

  const update = (id: string, patch: Partial<EventItem>) => {
    set({
      events: events.map((event) =>
        event.id === id ? { ...event, ...patch } : event,
      ),
    });
  };

  const remove = (id: string) => {
    set({ events: events.filter((event) => event.id !== id) });
  };

  const add = () => {
    set({
      events: [
        ...events,
        { id: crypto.randomUUID(), time: "", title: "", description: "" },
      ],
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = events.findIndex((event) => event.id === active.id);
    const newIndex = events.findIndex((event) => event.id === over.id);

    set({ events: arrayMove(events, oldIndex, newIndex) });
  };

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={events.map((event) => event.id)}
          strategy={verticalListSortingStrategy}
        >
          {events.map((event, index) => (
            <SortableItem key={event.id} id={event.id}>
              <div className="space-y-2 border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Event {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => remove(event.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={event.title}
                    onChange={(e) =>
                      update(event.id, { title: e.target.value })
                    }
                    placeholder="Ceremony"
                  />
                </div>
                <div>
                  <Label className="text-xs">Time</Label>
                  <Input
                    value={event.time}
                    onChange={(e) => update(event.id, { time: e.target.value })}
                    placeholder="4:00 PM"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={event.description}
                    onChange={(e) =>
                      update(event.id, { description: e.target.value })
                    }
                    placeholder="Optional details"
                  />
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" className="w-full" onClick={add}>
        <Plus className="h-4 w-4 mr-1" /> Add Event
      </Button>
    </div>
  );
}
