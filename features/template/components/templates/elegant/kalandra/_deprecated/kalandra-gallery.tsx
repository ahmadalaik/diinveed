"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as const,
      delay: 0.15,
    },
  },
};

const itemVariants = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
      delay,
    },
  },
});

interface Props {
  inv: InvitationState;
  openLightbox: (index: number) => void;
}

export function GalleryKalandra({ inv, openLightbox }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const preloadImage = (src: string) => {
    const img = new window.Image();
    img.src = src;
  };

  return (
    <section
      ref={sectionRef}
      className={cn("relative min-h-dvh px-8 py-24 snap-start")}
      style={{ clipPath: "inset(0)" }}
    >
      <div className="absolute inset-0 bg-black/15 -z-10" />
      <div className="relative z-10">
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
        >
          <h2
            className={cn(
              "font-medium text-4xl tracking-wider mb-1",
              "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
            )}
          >
            Our Moments
          </h2>
        </motion.div>

        {/* 
          PENGATURAN LAYOUT GALERI
          Ubah nilai di bawah ini menjadi "horizontal" atau "masonry" 
          untuk bolak-balik menguji tampilannya.
        */}
        {(() => {
          const layoutMode = "horizontal" as "horizontal" | "masonry";

          if (layoutMode === "horizontal") {
            const items = inv.gallery.items
              .filter((g) => g.url)
              .map((gallery, index) => ({ gallery, galleryIndex: index }))
              .slice(0, 10);
            const row1 = items.filter((_, i) => i % 2 === 0);
            const row2 = items.filter((_, i) => i % 2 !== 0);

            return (
              <div className="w-full flex flex-col gap-4">
                {/* Row 1 */}
                <div className="flex w-full overflow-x-auto gap-4 scrollbar-none">
                  {row1.map(({ gallery, galleryIndex }, index) => (
                    <motion.div
                      key={gallery.id}
                      className="relative h-[25vh] shrink-0 overflow-hidden cursor-zoom-in rounded-sm group flex"
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      variants={itemVariants(0.25 + index * 0.08)}
                      onClick={() => openLightbox(galleryIndex)}
                      onMouseEnter={() => preloadImage(gallery.url)}
                    >
                      <Image
                        src={gallery.url}
                        alt={`Gallery Row 1 - ${index + 1}`}
                        width={1200}
                        height={1200}
                        quality={90}
                        className="h-full w-auto max-w-none object-contain transition-all duration-500 group-hover:scale-105"
                      />
                    </motion.div>
                  ))}
                </div>
                {/* Row 2 */}
                {row2.length > 0 && (
                  <div className="flex w-full overflow-x-auto gap-4 scrollbar-none">
                    {row2.map(({ gallery, galleryIndex }, index) => (
                      <motion.div
                        key={gallery.id}
                        className="relative h-[25vh] shrink-0 overflow-hidden cursor-zoom-in rounded-sm group flex"
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={itemVariants(0.25 + index * 0.08)}
                        onClick={() => openLightbox(galleryIndex)}
                        onMouseEnter={() => preloadImage(gallery.url)}
                      >
                        <Image
                          src={gallery.url}
                          alt={`Gallery Row 2 - ${index + 1}`}
                          width={1200}
                          height={1200}
                          quality={90}
                          className="h-full w-auto max-w-none object-contain transition-all duration-500 group-hover:scale-105"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Default: Masonry
          return (
            <div className="columns-2 gap-2 space-y-2 pb-20">
              {inv.gallery.items
                .filter((g) => g.url)
                .map((gallery, index) => (
                  <motion.div
                    key={gallery.id}
                    className="relative group overflow-hidden cursor-zoom-in rounded-sm break-inside-avoid"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={itemVariants(0.25 + (index % 6) * 0.08)}
                    onClick={() => openLightbox(index)}
                    onMouseEnter={() => preloadImage(gallery.url)}
                  >
                    <Image
                      src={gallery.url}
                      alt={`Gallery ${index + 1}`}
                      width={1200}
                      height={1200}
                      quality={90}
                      className="w-full h-auto transition-all duration-500 group-hover:scale-105"
                    />
                  </motion.div>
                ))}
            </div>
          );
        })()}
      </div>
    </section>
  );
}
