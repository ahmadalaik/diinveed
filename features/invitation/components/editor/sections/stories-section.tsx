"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
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
    (s) => s.stories.find((e) => e.id === id)?.year ?? "",
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
    (s) => s.stories.find((e) => e.id === id)?.title ?? "",
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
    (s) => s.stories.find((e) => e.id === id)?.body ?? "",
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

interface StoryCardProps {
  id: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function StoryCard({ id, index, total, onMoveUp, onMoveDown }: StoryCardProps) {
  const set = useInvitationStore((s) => s.set);

  const remove = () => {
    const stories = useInvitationStore.getState().stories;
    set({ stories: stories.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-2 border rounded-lg p-3 bg-card overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Chapter {index + 1}
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
            aria-label="Hapus story"
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
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
  const ids = useInvitationStore(useShallow((s) => s.stories.map((e) => e.id)));
  const set = useInvitationStore((s) => s.set);

  const add = () => {
    const stories = useInvitationStore.getState().stories;
    set({
      stories: [
        ...stories,
        { id: crypto.randomUUID(), year: "", title: "", body: "" },
      ],
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const stories = useInvitationStore.getState().stories;
    const target = index + direction;
    if (target < 0 || target >= stories.length) return;
    set({ stories: arrayMove(stories, index, target) });
  };

  return (
    <div className="space-y-3">
      {ids.map((id, index) => (
        <StoryCard
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
        className="w-full hover:cursor-pointer"
        onClick={add}
      >
        <Plus className="h-4 w-4 mr-1" /> Add Chapter
      </Button>
    </div>
  );
}
