import type { Area } from "react-easy-crop";

export interface OutputSize {
  width: number;
  height: number;
}

export function getOutputSize(
  width: number,
  height: number,
  maxEdge: number,
): OutputSize {
  const longest = Math.max(width, height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () =>
      reject(new Error("Failed to load image")),
    );
    img.src = src;
  });
}

export async function getCroppedBlob(
  imageSrc: string,
  croppedAreaPixels: Area,
  maxEdge = 800,
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const { width, height } = getOutputSize(
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    maxEdge,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    width,
    height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
      "image/webp",
      0.9,
    );
  });
}
