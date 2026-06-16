"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicWishes } from "@/features/invitation/actions/get-public-wishes";
import type { PublicWish } from "@/features/invitation/types/invitation.type";

interface Props {
  publicToken: string;
  showCategory: boolean;
  mode?: "preview" | "guest";
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function WishesRenjana({ publicToken, showCategory, mode }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [wishes, setWishes] = useState<PublicWish[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const isPreview = mode === "preview";

  useEffect(() => {
    if (isPreview) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const result = await getPublicWishes(publicToken, 1);
      if (cancelled) return;
      if (result.wishes) {
        setWishes(result.wishes);
        setTotalPages(result.totalPages);
        setPage(1);
      }
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [publicToken, isPreview]);

  const loadMore = async () => {
    const next = page + 1;
    setLoading(true);
    const result = await getPublicWishes(publicToken, next);
    if (result.wishes) {
      setWishes((prev) => [...prev, ...result.wishes]);
      setPage(next);
      setTotalPages(result.totalPages);
    }
    setLoading(false);
  };

  return (
    <section
      ref={ref}
      id="wishes"
      className="px-8 py-24 bg-[#fbf0ef] relative overflow-hidden"
    >
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
      >
        <h2 className="font-(family-name:--font-serif) text-4xl text-[#a85d6b] mb-3">
          Ucapan & Doa
        </h2>
        <div className="w-12 h-px bg-[#c98a96] mx-auto mb-4" />
        <p className="text-[10px] text-stone-500 text-balance uppercase tracking-[0.2em]">
          Ucapan hangat dari mereka yang berbahagia
        </p>
      </motion.div>

      <div className="max-w-md mx-auto space-y-4">
        {isPreview ? (
          <p className="text-center text-[10px] text-amber-500 tracking-widest uppercase">
            Preview Mode · Ucapan tampil di undangan publik
          </p>
        ) : wishes.length === 0 && !loading ? (
          <p className="text-center text-sm text-stone-400 py-8">
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        ) : (
          wishes.map((w) => (
            <div
              key={w.id}
              className="rounded-md bg-white/80 shadow-sm p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageCircleHeart
                  strokeWidth={1.5}
                  className="size-4 text-[#c98a96]"
                />
                <p className="text-sm font-medium text-stone-700">{w.name}</p>
                {showCategory && w.category && (
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-200 rounded-full px-2 py-0.5">
                    {w.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-600 whitespace-pre-line pl-6">
                {w.wish}
              </p>
            </div>
          ))
        )}

        {!isPreview && page < totalPages && (
          <div className="text-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={loadMore}
              disabled={loading}
              className="text-xs uppercase tracking-widest"
            >
              {loading ? "Memuat…" : "Muat lebih banyak"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
