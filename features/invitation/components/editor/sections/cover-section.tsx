"use client";

import { Button } from "@/components/ui/button";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useCloudinaryUpload } from "@/features/template/hooks/use-cloudinary-upload";
import { Upload, X } from "lucide-react";
import { useRef } from "react";

export function CoverSection() {
  const coverImage = useInvitationStore((s) => s.coverImage);
  const set = useInvitationStore((s) => s.set);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, uploadProgress } = useCloudinaryUpload();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await upload(file);
    set({ coverImage: url });
  };

  return (
    <div className="space-y-3">
      {coverImage ? (
        <div className="relative">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-32 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => set({ coverImage: null })}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {isUploading ? `Uploading ${uploadProgress}%` : "Click to upload"}
          </span>
        </button>
      )}
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
