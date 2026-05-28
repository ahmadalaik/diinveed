"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useCloudinaryUpload } from "@/features/template/hooks/use-cloudinary-upload";
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
import { useRef } from "react";

function SortablePhoto({
  url,
  onRemove,
}: {
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
  } = useSortable({ id: url });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative ${isDragging ? "opacity-50 z-10" : ""}`}
    >
      <img
        src={url}
        alt=""
        className="w-full h-16 object-cover rounded-md cursor-grab"
        {...attributes}
        {...listeners}
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-4 w-4 flex items-center justify-center"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}

export function GallerySection() {
  const gallery = useInvitationStore((s) => s.gallery);
  const set = useInvitationStore((s) => s.set);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useCloudinaryUpload();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await upload(file);
    set({ gallery: [...gallery, url] });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = gallery.indexOf(active.id as string);
    const newIndex = gallery.indexOf(over.id as string);
    set({ gallery: arrayMove(gallery, oldIndex, newIndex) });
  };

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={gallery} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((url) => (
              <SortablePhoto
                key={url}
                url={url}
                onRemove={() =>
                  set({ gallery: gallery.filter((u) => u !== url) })
                }
              />
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="h-16 border-2 border-dashed rounded-md flex items-center justify-center hover:bg-muted/50 transition-colors"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </SortableContext>
      </DndContext>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
