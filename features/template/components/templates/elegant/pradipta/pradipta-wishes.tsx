"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MessageCircleHeart } from "lucide-react";
import { cn } from "@/lib/utils";
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

const DUMMY_WISHES: PublicWish[] = [
  {
    id: "dummy-1",
    name: "Ahmad & Keluarga",
    wish: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
    category: "Keluarga",
    createdAt: new Date(),
  },
  {
    id: "dummy-2",
    name: "Budi Santoso",
    wish: "Happy wedding! Lancar-lancar sampai hari H ya.",
    category: "Sahabat",
    createdAt: new Date(),
  },
  {
    id: "dummy-3",
    name: "Citra",
    wish: "Selamat ya! Semoga bahagia selalu bersama pasangan.",
    category: "Rekan Kerja",
    createdAt: new Date(),
  },
];

export function PradiptaWishes({ publicToken, showCategory, mode }: Props) {
  const isPreview = mode === "preview" || publicToken === "preview";
  const [wishes, setWishes] = useState<PublicWish[]>(
    isPreview ? DUMMY_WISHES : [],
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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
    <section id="wishes" className="py-24 relative overflow-hidden">
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp}
      >
        <h2
          className={cn(
            "text-4xl mb-3",
            "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
          )}
        >
          Ucapan & Doa
        </h2>
        <div
          className={cn("w-12 h-px mx-auto mb-4", "bg-(--tpl-text-tertiary)")}
        />
        <p className="text-[10px] text-(--tpl-text-primary)/60 text-balance uppercase tracking-[0.2em]">
          Ucapan hangat dari mereka yang berbahagia
        </p>
      </motion.div>

      <div className="max-w-md mx-auto space-y-4">
        {wishes.length === 0 && !loading ? (
          <p className="text-center text-sm text-(--tpl-text-primary)/50 py-8">
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        ) : (
          wishes.map((w) => (
            <div
              key={w.id}
              className="rounded-md bg-(--tpl-bg-secondary)/80 shadow-sm p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageCircleHeart
                  strokeWidth={1.5}
                  className={cn("size-4", "text-(--tpl-text-tertiary)")}
                />
                <p className="text-sm font-medium text-(--tpl-text-primary)/90">
                  {w.name}
                </p>
                {showCategory && w.category && (
                  <span className="text-[10px] uppercase tracking-wider text-(--tpl-text-primary)/50 border border-(--tpl-text-primary)/20 rounded-full px-2 py-0.5">
                    {w.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-(--tpl-text-primary)/80 whitespace-pre-line pl-6">
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
