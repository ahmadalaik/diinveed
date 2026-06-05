"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { StoryItem } from "@/features/invitation/types/invitation.type";
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
import { useStoryUpdate } from "@/features/invitation/hooks/editor-sections/use-story-update";
import {
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../editor-field";
import { FieldGroup } from "@/components/ui/field";
import { useShallow } from "zustand/shallow";

function StoryYearField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => (s.stories as StoryItem[]).find((e) => e.id === id)?.year ?? "",
  );
  const update = useStoryUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`story-year-${id}`}>Tahun</EditorLabel>
      <EditorInput
        id={`story-year-${id}`}
        autoComplete="off"
        placeholder="2024"
        value={value}
        onChange={(e) => update({ year: e.target.value })}
      />
    </EditorField>
  );
}

function StoryTitleField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => (s.stories as StoryItem[]).find((e) => e.id === id)?.title ?? "",
  );
  const update = useStoryUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`story-title-${id}`}>Event</EditorLabel>
      <EditorInput
        id={`story-title-${id}`}
        autoComplete="off"
        placeholder="Pertama Bertemu"
        value={value}
        onChange={(e) => update({ title: e.target.value })}
      />
    </EditorField>
  );
}

function StoryDescriptionField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => (s.stories as StoryItem[]).find((e) => e.id === id)?.body ?? "",
  );
  const update = useStoryUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`story-desc-${id}`}>Story</EditorLabel>
      <EditorTextarea
        id={`story-desc-${id}`}
        placeholder="Berawal dari teman kuliah dan kebetulan satu organisasi.."
        value={value}
        onChange={(e) => update({ body: e.target.value })}
      />
    </EditorField>
  );
}

function StoryCard({ id, index }: { id: string; index: number }) {
  const set = useInvitationStore((s) => s.set);

  const remove = () => {
    const stories = useInvitationStore.getState().stories as StoryItem[];
    set({ stories: stories.filter((e) => e.id !== id) });
  };

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Chapter {index + 1}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => remove}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <FieldGroup>
        <StoryYearField id={id} />
        <StoryTitleField id={id} />
        <StoryDescriptionField id={id} />
      </FieldGroup>
    </div>
  );
}

export function StoriesSection() {
  const ids = useInvitationStore(
    useShallow((s) => (s.stories as StoryItem[]).map((e) => e.id)),
  );
  const set = useInvitationStore((s) => s.set);
  const sensors = useSensors(useSensor(PointerSensor));

  const add = () => {
    const stories = useInvitationStore.getState().stories as StoryItem[];
    set({
      stories: [
        ...stories,
        { id: crypto.randomUUID(), year: "", title: "", body: "" },
      ],
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const stories = useInvitationStore.getState().stories as StoryItem[];
    const oldIndex = stories.findIndex((s) => s.id === active.id);
    const newIndex = stories.findIndex((s) => s.id === over.id);
    set({ stories: arrayMove(stories, oldIndex, newIndex) });
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
              <StoryCard id={id} index={index} />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" className="w-full" onClick={add}>
        <Plus className="h-4 w-4 mr-1" /> Add Chapter
      </Button>
    </div>
  );
}
