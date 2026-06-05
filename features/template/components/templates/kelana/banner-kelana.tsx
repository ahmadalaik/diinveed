"use client";

import Image from "next/image";
import { format } from "date-fns";
import { CalendarHeart } from "lucide-react";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";

interface Props {
  inv: InvitationState;
}

export function BannerKelana({ inv }: Props) {
  return (
    <aside className="relative w-full h-[60vh] lg:h-svh lg:sticky lg:top-0 overflow-hidden bg-stone-900">
      <div className="absolute inset-0">
        {inv.coverImage && (
          <Image
            loader={cloudinaryLoader}
            src={inv.coverImage}
            alt="Cover Image"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover animate-slow-zoom"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay"></div>
      </div>

      <div className="absolute bottom-10 left-6 lg:bottom-16 lg:left-16 z-20 text-white max-w-4xl">
        <p className="lg:text-xl uppercase text-lg italic text-[#d4cbb3] tracking-widest font-serif font-medium border-[#d4cbb3] border-l-2 mb-6 pl-4">
          The Wedding Celebration
        </p>

        <h1 className="lg:text-9xl leading-none text-7xl font-script mb-2 drop-shadow-lg">
          {inv.brideNickname}{" "}
          <span className="lg:text-7xl sm:ml-0 lg:ml-24 xl:ml-0 text-5xl opacity-80 ml-16">
            &amp;
          </span>{" "}
          {inv.groomNickname}
        </h1>

        <div className="mt-8 flex items-center gap-4 text-[#d4cbb3]">
          <CalendarHeart />
          <span className="font-serif-heading text-xl tracking-wide">
            {inv.time && format(inv.time, "PPP")}
          </span>
        </div>
      </div>
    </aside>
  );
}
