"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type Props = {
  id: string;
  children: React.ReactNode;
};

export function SortableItem({ id, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "z-10 relative" : ""}
    >
      <div className="flex gap-2 items-start">
        <Button
          variant="secondary"
          type="button"
          className={cn(
            "mt-2.5 border-border touch-none text-muted-foreground hover:text-foreground",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </Button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
