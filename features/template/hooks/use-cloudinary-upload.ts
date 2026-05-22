"use client";

import { useCallback, useState } from "react";

export interface UploadedImage {
  url: string;
  publicId: string;
}

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function upload(file: File): Promise<UploadedImage> {
    setIsUploading(true);
    setUploadProgress(0);

    const sigRes = await fetch("/api/cloudinary/signature");
    if (!sigRes.ok) {
      setIsUploading(false);
      throw new Error("Failed to get upload signature");
    }

    const { signature, timestamp, folder, apiKey, cloudName } =
      await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);

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
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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
