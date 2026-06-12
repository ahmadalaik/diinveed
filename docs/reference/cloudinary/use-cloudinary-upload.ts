"use client";

import { useCallback, useState } from "react";

export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface UploadOptions {
  kind?: "image" | "audio";
}

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function upload(
    file: File,
    opts: UploadOptions = {},
  ): Promise<UploadedImage> {
    setIsUploading(true);
    setUploadProgress(0);

    const query = opts.kind === "audio" ? "?kind=audio" : "";
    const sigRes = await fetch(`/api/cloudinary/signature${query}`);
    if (!sigRes.ok) {
      setIsUploading(false);
      throw new Error("Failed to get upload signature");
    }

    const {
      signature,
      timestamp,
      folder,
      transformation,
      format,
      resourceType,
      apiKey,
      cloudName,
    } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);
    // Only present for image uploads (compress + resize, store as WebP). Values
    // must match exactly what the signature route signed; audio is stored
    // untransformed, so these are omitted there.
    if (transformation) formData.append("transformation", transformation);
    if (format) formData.append("format", format);

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
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url, publicId: data.public_id });
        } else {
          reject(new Error("Cloudinary upload failed"));
        }
      });

      xhr.addEventListener("error", () => {
        setIsUploading(false);
        reject(new Error("Cloudinary upload failed"));
      });

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType ?? "image"}/upload`,
      );
      xhr.send(formData);
    });
  }

  const remove = useCallback(async (publicId: string): Promise<void> => {
    try {
      await fetch(`/api/cloudinary/${publicId}`, { method: "DELETE" });
    } catch {
      console.warn("Failed to delete image from Cloudinary:", publicId);
    }
  }, []);

  return { upload, remove, isUploading, uploadProgress };
}
