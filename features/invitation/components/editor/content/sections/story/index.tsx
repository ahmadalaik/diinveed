"use client";

import {
  useInvitationStore,
  useInvitationStoreApi,
} from "@/features/invitation/store/invitation-store";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EditorError } from "../../../editor-field";
import { useShallow } from "zustand/shallow";
import { StoryCard } from "./story-card";
import { StoryEnabledField } from "./story-field";

export function StoriesSection() {
  const store = useInvitationStoreApi();
  const ids = useInvitationStore(
    useShallow((s) => s.stories.items.map((e) => e.id)),
  );
  const isEnabled = useInvitationStore((s) => s.stories.enabled);
  const errors = useInvitationStore((s) => s.publishErrors?.stories);
  const set = useInvitationStore((s) => s.set);

  const MAX_CHAPTER = 5;

  const add = () => {
    const stories = store.getState().stories;
    if (stories.items.length >= MAX_CHAPTER) return;

    set({
      stories: {
        ...stories,
        items: [
          ...stories.items,
          { id: crypto.randomUUID(), year: "", title: "", body: "" },
        ],
      },
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const stories = store.getState().stories;
    const target = index + direction;
    if (target < 0 || target >= stories.items.length) return;
    set({
      stories: { ...stories, items: arrayMove(stories.items, index, target) },
    });
  };

  if (!isEnabled) {
    return (
      <div className="space-y-3 py-4">
        <StoryEnabledField />
        <div className="flex flex-col justify-center items-center w-full h-20 rounded-md bg-muted text-muted-foreground text-xs">
          <span>Section hadiah tidak ditampilkan di undangan</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-publish-field="stories"
      data-invalid={Boolean(errors?.length) || undefined}
      className="space-y-3 py-4"
    >
      <EditorError errors={errors} />
      <StoryEnabledField />
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
