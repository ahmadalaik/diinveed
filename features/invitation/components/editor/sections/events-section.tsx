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
import { useShallow } from "zustand/react/shallow";
import { SortableItem } from "../sortable-item";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import {
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../editor-field";

function useEventUpdate(id: string) {
  const set = useInvitationStore((s) => s.set);
  return (patch: Partial<EventItem>) => {
    const events = useInvitationStore.getState().events as EventItem[];
    set({
      events: events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };
}

function EventTitleField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => (s.events as EventItem[]).find((e) => e.id === id)?.title ?? "",
  );
  const update = useEventUpdate(id);
  return (
    <EditorField>
      <EditorLabel htmlFor={`event-title-${id}`}>Nama Acara</EditorLabel>
      <EditorInput
        id={`event-title-${id}`}
        autoComplete="off"
        placeholder="Akad Nikah"
        value={value}
        onChange={(e) => update({ title: e.target.value })}
      />
    </EditorField>
  );
}

function EventTimeField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => (s.events as EventItem[]).find((e) => e.id === id)?.time ?? "",
  );
  const update = useEventUpdate(id);
  return (
    <EditorField>
      <EditorLabel htmlFor={`event-time-${id}`}>Waktu</EditorLabel>
      <EditorInput
        id={`event-time-${id}`}
        autoComplete="off"
        placeholder="08.00 - 10.00 WIB"
        value={value}
        onChange={(e) => update({ time: e.target.value })}
      />
    </EditorField>
  );
}

function EventDescField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) =>
      (s.events as EventItem[]).find((e) => e.id === id)?.description ?? "",
  );
  const update = useEventUpdate(id);
  return (
    <EditorField>
      <EditorLabel htmlFor={`event-desc-${id}`}>Deskripsi</EditorLabel>
      <EditorTextarea
        id={`event-desc-${id}`}
        placeholder="Bertempat di Gedung Serbaguna, Jl. Merdeka No. 1"
        value={value}
        onChange={(e) => update({ description: e.target.value })}
      />
    </EditorField>
  );
}

function EventCard({ id, index }: { id: string; index: number }) {
  const set = useInvitationStore((s) => s.set);

  const remove = () => {
    const events = useInvitationStore.getState().events as EventItem[];
    set({ events: events.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-2 border rounded-lg p-3 bg-card overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Event {index + 1}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 hover:bg-destructive/10 hover:cursor-pointer"
          onClick={remove}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>
      <FieldGroup>
        <EventTitleField id={id} />
        <EventTimeField id={id} />
        <EventDescField id={id} />
      </FieldGroup>
    </div>
  );
}

export function EventsSection() {
  const ids = useInvitationStore(
    useShallow((s) => (s.events as EventItem[]).map((e) => e.id)),
  );
  const set = useInvitationStore((s) => s.set);
  const sensors = useSensors(useSensor(PointerSensor));

  const add = () => {
    const events = useInvitationStore.getState().events as EventItem[];
    set({
      events: [
        ...events,
        { id: crypto.randomUUID(), time: "", title: "", description: "" },
      ],
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const events = useInvitationStore.getState().events as EventItem[];
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
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {ids.map((id, index) => (
            <SortableItem key={id} id={id}>
              <EventCard id={id} index={index} />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" className="w-full hover:cursor-pointer" onClick={add}>
        <Plus className="h-4 w-4 mr-1" /> Tambah Event
      </Button>
    </div>
  );
}
