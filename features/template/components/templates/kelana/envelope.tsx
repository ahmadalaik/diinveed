"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface Props {
  onOpen: (open: boolean) => void;
}

export default function EnvelopeKelana({ onOpen }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  return (
    <section
      onClick={() => {
        setIsClosing(true);
        onOpen(true);
      }}
      className={cn(
        "fixed right-0 top-0 z-50 transition-transform duration-1000 ease-in-out cursor-pointer",
        "w-full lg:w-[25%] h-svh flex justify-center items-center px-8 py-14 text-center bg-stone-900",
        isClosing ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-5000 ease-in-out overflow-hidden",
          "opacity-80",
        )}
      >
        <Image
          src="https://images.pexels.com/photos/36190389/pexels-photo-36190389.jpeg"
          alt="Thumbnail"
          fill
          priority
          sizes="(max-width: 768px) 250vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/40" />
      </div>
    </section>
  );
}
