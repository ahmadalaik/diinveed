"use client";

import { Button } from "@/components/ui/button";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useR2Upload } from "@/hooks/use-r2-upload";
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
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { EditorError } from "../../editor-field";
import { Input } from "@/components/ui/input";
import { SortablePhoto } from "./sortable-photo";
import { GalleryEnabledField } from "./gallery-field";

export function GallerySection() {
  const gallery = useInvitationStore((s) => s.gallery);
  const isEnabled = useInvitationStore((s) => s.gallery.enabled);
  const errors = useInvitationStore((s) => s.publishErrors?.gallery);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const MAX_GALLERY_IMAGE = 10;
  const MAX_SIZE_MB = 12;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
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
      gallery: {
        ...gallery,
        items: [...gallery.items, { id: crypto.randomUUID(), url, key }],
      },
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = gallery.items.findIndex((g) => g.id === active.id);
    const newIndex = gallery.items.findIndex((g) => g.id === over.id);
    set({
      gallery: {
        ...gallery,
        items: arrayMove(gallery.items, oldIndex, newIndex),
      },
    });
  };

  const handleRemove = async (id: string, key: string) => {
    await remove(key);
    set({
      gallery: {
        ...gallery,
        items: gallery.items.filter((g) => g.id !== id),
      },
    });
  };

  if (!isEnabled) {
    return (
      <div className="space-y-3 py-4">
        <GalleryEnabledField />
        <div className="flex flex-col justify-center items-center w-full h-30">
          <span className="text-xs">
            Section gallery tidak ditampilkan di undangan
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-publish-field="gallery"
      data-invalid={Boolean(errors?.length) || undefined}
      className="py-4"
    >
      <EditorError errors={errors} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={gallery.items.map((g) => g.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-3 gap-2.5">
            {gallery.items.map((item) => (
              <SortablePhoto
                key={item.id}
                id={item.id}
                url={item.url}
                onRemove={() => handleRemove(item.id, item.key)}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={
                gallery.items.length >= MAX_GALLERY_IMAGE || isUploading
              }
              aria-invalid={Boolean(errors?.length)}
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
