"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import Image from "next/image";

interface Props {
  id: string;
  url: string;
  onRemove: () => Promise<void> | void;
}

export function SortablePhoto({ id, url, onRemove }: Props) {
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
      className={cn("group relative", isDragging && "z-10 opacity-50")}
    >
      <AspectRatio
        ratio={3 / 4}
        className="overflow-hidden rounded-md border bg-muted"
        {...attributes}
        {...listeners}
      >
        <Image
          fill
          src={url}
          alt=""
          sizes="200px"
          className={cn(
            "object-cover",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        />
      </AspectRatio>
      <Button
        type="button"
        aria-label="Hapus foto galeri"
        size="icon"
        variant="secondary"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-1 top-1 size-5 rounded-full bg-background/70 text-muted-foreground shadow-sm backdrop-blur-sm hover:bg-background hover:text-destructive hover:cursor-pointer"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
