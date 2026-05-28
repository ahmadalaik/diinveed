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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function StoriesSection() {
  const stories = useInvitationStore((s) => s.stories as StoryItem[]);
  const set = useInvitationStore((s) => s.set);
  const sensors = useSensors(useSensor(PointerSensor));

  const update = (id: string, patch: Partial<StoryItem>) => {
    set({
      stories: stories.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };

  const remove = (id: string) => {
    set({ stories: stories.filter((s) => s.id !== id) });
  };

  const add = () => {
    set({
      stories: [
        ...stories,
        { id: crypto.randomUUID(), year: "", title: "", body: "" },
      ],
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
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
        <SortableContext
          items={stories.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {stories.map((story, i) => (
            <SortableItem key={story.id} id={story.id}>
              <div className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Chapter {i + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => remove(story.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Year</Label>
                    <Input
                      value={story.year}
                      onChange={(e) =>
                        update(story.id, { year: e.target.value })
                      }
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={story.title}
                      onChange={(e) =>
                        update(story.id, { title: e.target.value })
                      }
                      placeholder="We met"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Story</Label>
                  <Textarea
                    value={story.body}
                    onChange={(e) => update(story.id, { body: e.target.value })}
                    rows={2}
                    placeholder="Tell the story…"
                  />
                </div>
              </div>
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
