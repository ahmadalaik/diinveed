"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useStoryUpdate } from "@/features/invitation/hooks/editor-sections/use-story-update";
import {
  EditorError,
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../editor-field";
import { FieldGroup } from "@/components/ui/field";
import { useShallow } from "zustand/shallow";
import { DatePicker } from "@/components/ui/date-picker";

function StoryYearField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.stories.find((e) => e.id === id)?.year ?? "",
  );
  const update = useStoryUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`story-year-${id}`}>Tanggal</EditorLabel>
      <DatePicker
        id={`story-year-${id}`}
        value={value}
        onChange={(year) => update({ year })}
        yearsBack={10}
        yearsForward={1}
        className="h-auto border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none hover:bg-muted"
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
        <span className="text-xs font-medium text-muted-foreground uppercase">
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
      <FieldGroup className="gap-3">
        <StoryYearField id={id} />
        <StoryTitleField id={id} />
        <StoryDescriptionField id={id} />
      </FieldGroup>
    </div>
  );
}

export function StoriesSection() {
  const ids = useInvitationStore(useShallow((s) => s.stories.map((e) => e.id)));
  const errors = useInvitationStore((s) => s.publishErrors?.stories);
  const set = useInvitationStore((s) => s.set);

  const MAX_CHAPTER = 3;

  const add = () => {
    const stories = useInvitationStore.getState().stories;
    if (stories.length >= MAX_CHAPTER) return;

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
      <EditorError errors={errors} />
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
        className="w-full flex items-center justify-center gap-1 border-2 border-dashed text-muted-foreground shadow-none hover:cursor-pointer"
        disabled={ids.length >= MAX_CHAPTER}
        onClick={add}
      >
        <Plus className="size-4" />
        <span className="text-[12px]">Tambah Chapter</span>
      </Button>
    </div>
  );
}
