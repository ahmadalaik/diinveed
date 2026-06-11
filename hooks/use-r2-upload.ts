"use client";

import { useCallback, useState } from "react";
import { resizeToWebp } from "@/lib/image/resize-image";
import type { StorageKind } from "@/lib/storage/types";

export interface UploadedImage {
  url: string;
  key: string;
}

export interface UploadOptions {
  kind: StorageKind;
  /** Required for invitation-scoped kinds (gallery/couple/cover/music); omit for thumbnail. */
  invitationId?: string;
}

export function useR2Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function upload(
    file: File,
    opts: UploadOptions,
  ): Promise<UploadedImage> {
    setIsUploading(true);
    setUploadProgress(0);

    // Images: shrink to <=2000px WebP before upload. Music: send as-is.
    const isImage = opts.kind !== "music";
    const body: Blob = isImage ? await resizeToWebp(file) : file;
    const ext = isImage ? "webp" : file.name.split(".").pop() || "bin";
    const contentType = isImage ? "image/webp" : file.type || "application/octet-stream";

    let sigRes: Response;
    try {
      sigRes = await fetch("/api/storage/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: opts.kind,
          ext,
          contentType,
          invitationId: opts.invitationId,
        }),
      });
    } catch (e) {
      setIsUploading(false);
      throw e;
    }
    if (!sigRes.ok) {
      setIsUploading(false);
      throw new Error("Failed to get upload url");
    }
    let uploadUrl: string;
    let key: string;
    let publicUrl: string;
    try {
      ({ uploadUrl, key, publicUrl } = await sigRes.json());
    } catch (e) {
      setIsUploading(false);
      throw e;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      xhr.addEventListener("load", () => {
        setIsUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ url: publicUrl, key });
        } else {
          reject(new Error("R2 upload failed"));
        }
      });
      xhr.addEventListener("error", () => {
        setIsUploading(false);
        reject(new Error("R2 upload failed"));
      });
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.send(body);
    });
  }

  const remove = useCallback(async (key: string): Promise<void> => {
    try {
      await fetch("/api/storage/object", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
    } catch {
      console.warn("Failed to delete object from R2:", key);
    }
  }, []);

  return { upload, remove, isUploading, uploadProgress };
}
