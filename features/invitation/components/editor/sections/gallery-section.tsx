"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { cn } from "@/lib/utils";
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
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { EditorError } from "../editor-field";
import { Input } from "@/components/ui/input";

function SortablePhoto({
  id,
  url,
  onRemove,
}: {
  id: string;
  url: string;
  onRemove: () => void;
}) {
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
        size="icon"
        variant="secondary"
        onClick={onRemove}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-1 top-1 size-5 rounded-full bg-background/70 text-muted-foreground shadow-sm backdrop-blur-sm hover:bg-background hover:text-destructive hover:cursor-pointer"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}

export function GallerySection() {
  const gallery = useInvitationStore((s) => s.gallery);
  const errors = useInvitationStore((s) => s.publishErrors?.gallery);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, uploadProgress } = useR2Upload();
  const sensors = useSensors(useSensor(PointerSensor));

  const MAX_SIZE_MB = 8;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const MAX_GALLERY_IMAGE = 3;
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`Ukuran gambar maksimal ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setSizeError(null);
    const { url, key } = await upload(file, { kind: "gallery", invitationId });
    set({
      gallery: [...gallery, { id: crypto.randomUUID(), url, key }],
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = gallery.findIndex((g) => g.id === active.id);
    const newIndex = gallery.findIndex((g) => g.id === over.id);
    set({ gallery: arrayMove(gallery, oldIndex, newIndex) });
  };

  return (
    <div className="space-y-2">
      <EditorError errors={errors} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={gallery.map((g) => g.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((item) => (
              <SortablePhoto
                key={item.id}
                id={item.id}
                url={item.url}
                onRemove={() =>
                  set({ gallery: gallery.filter((g) => g.id !== item.id) })
                }
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={gallery.length >= MAX_GALLERY_IMAGE || isUploading}
              className="aspect-3/4 h-auto w-full border-2 border-dashed text-muted-foreground hover:cursor-pointer"
            >
              {isUploading ? (
                <span className="text-xs">{uploadProgress}%</span>
              ) : (
                <Plus className="size-4" />
              )}
            </Button>
          </div>
        </SortableContext>
      </DndContext>
      {sizeError && <EditorError errors={[sizeError]} />}
      <Input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
