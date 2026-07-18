"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  inv: InvitationState;
  openLightbox: (index: number) => void;
}

export function PradiptaGallery({ inv, openLightbox }: Props) {
  const preloadImage = (src: string) => {
    const img = new window.Image();
    img.src = src;
  };

  return (
    <section className="px-2 py-16 bg-(--tpl-bg-secondary)">
      <motion.div
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={headingVariants}
      >
        <h2
          className={cn(
            "font-medium text-3xl tracking-wider mb-6",
            "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
          )}
        >
          Our Moments
        </h2>
      </motion.div>

      {(() => {
        const layoutMode = "masonry" as "horizontal" | "masonry";

        if (layoutMode === "horizontal") {
          const items = inv.gallery.items
            .filter((g) => g.url)
            .map((gallery, index) => ({ gallery, galleryIndex: index }))
            .slice(0, 10);
          const row1 = items.filter((_, i) => i % 2 === 0);
          const row2 = items.filter((_, i) => i % 2 !== 0);

          return (
            <div className="w-full flex flex-col gap-4 pb-8">
              {/* Row 1 */}
              <div className="flex w-full overflow-x-auto gap-4 scrollbar-none">
                {row1.map(({ gallery, galleryIndex }, index) => (
                  <motion.div
                    key={gallery.id}
                    className="relative h-[25vh] shrink-0 overflow-hidden cursor-zoom-in rounded-sm group flex"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
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
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
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
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
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
    </section>
  );
}
