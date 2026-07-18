"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldSet } from "@/components/ui/field";
import {
  rsvpFormSchema,
  RsvpFormType,
} from "@/features/invitation/schemas/rsvp.schema";
import { submitRsvp } from "@/features/invitation/actions/submit-rsvp";
import { cn } from "@/lib/utils";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import {
  kalandraTokens,
  templateCssVars,
  mergeTemplateTokenOverrides,
} from "@/features/template/tokens";
import { RsvpNameInput } from "./rsvp/rsvp-name-input";
import { RsvpAttendanceInput } from "./rsvp/rsvp-attendance-input";
import { RsvpWishesInput } from "./rsvp/rsvp-wishes-input";
import { KalandraWishes } from "./kalandra-wishes";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  publicToken: string;
  mode?: "preview" | "guest";
  guestSlug?: string;
  guestName?: string;
  inv?: InvitationState;
  wishesEnabled?: boolean;
}

export function KalandraRsvpAndWishes({
  publicToken,
  mode = "guest",
  guestSlug,
  guestName,
  inv,
  wishesEnabled = true,
}: Props) {
  const themeStyle = inv
    ? templateCssVars(
        mergeTemplateTokenOverrides(kalandraTokens, inv.tokenOverrides),
      )
    : undefined;

  const form = useForm<RsvpFormType>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: guestName ?? "",
      phoneNumber: "",
      response: undefined,
      guests: "1",
      wish: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;
  // const isPreview = mode === "preview" || publicToken === "preview";
  const isPreview = mode === "preview";

  const onSubmit = async (data: RsvpFormType) => {
    try {
      const result = await submitRsvp(publicToken, data, guestSlug);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      reset();
    } catch {
      toast.error("Gagal mengirim rsvp, coba lagi beberapa saat.");
    }
  };

  return (
    <section
      id="rsvp-wishes"
      className="px-8 py-24 bg-(--tpl-bg-primary) relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl bg-(--tpl-bg-tertiary)/5" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full -ml-16 -mb-16 blur-3xl bg-(--tpl-bg-secondary)/10" />

      <motion.div
        className="text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp(0)}
      >
        <h2 className="text-4xl mb-3 font-(family-name:--tpl-font-heading) text-(--tpl-text-secondary)">
          R.S.V.P
        </h2>
        <div className="w-12 h-px mx-auto mb-4 bg-(--tpl-text-secondary)" />
        <p className="text-xs font-light text-balance leading-relaxed text-(--tpl-text-tertiary)">
          Silakan konfirmasikan kehadiran Anda dan sampaikan doa serta harapan
          terbaik.
        </p>
      </motion.div>

      {isPreview && (
        <p className="text-center text-[10px] text-amber-500 tracking-widest uppercase mb-4 flex items-center justify-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Mode Preview · Form dinonaktifkan
        </p>
      )}

      <motion.div
        className="max-w-md mx-auto mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp(0.2)}
      >
        <FieldSet disabled={isSubmitting || isPreview}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <RsvpNameInput control={form.control} />
            <RsvpAttendanceInput
              control={form.control}
              themeStyle={themeStyle}
            />
            <RsvpWishesInput control={form.control} />
            <Button
              type="submit"
              className={cn(
                "w-full mt-2 py-6 rounded-md text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-lg active:scale-[0.98] group",
                "bg-(--tpl-btn-bg-primary) hover:bg-(--tpl-btn-bg-secondary) hover:shadow-(--tpl-btn-bg-secondary)/20 text-(--tpl-btn-text-primary)",
              )}
            >
              <span className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    Mengirim...
                    <Loader2 className="size-3 animate-spin" />
                  </>
                ) : (
                  <>
                    Kirim RSVP
                    <Send className="size-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </form>
        </FieldSet>
      </motion.div>

      {wishesEnabled && (
        <KalandraWishes
          publicToken={publicToken}
          showCategory={inv?.wishesOptions?.showCategory ?? false}
          mode={mode}
        />
      )}

      {/* {wishesEnabled && (
        <motion.div
          className="max-w-md mx-auto space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          variants={fadeUp(0.4)}
        >
          <div className="text-center mb-8">
            <h3 className="text-4xl font-(family-name:--tpl-font-heading) text-(--tpl-text-secondary)">
              Ucapan & Doa
            </h3>
            <div className="w-8 h-px mx-auto mt-3 bg-(--tpl-text-tertiary)" />
          </div>

          {wishes.length === 0 && !loadingWishes ? (
            <p className="text-center text-sm text-(--tpl-text-primary)/50 py-8">
              Belum ada ucapan. Jadilah yang pertama!
            </p>
          ) : (
            wishes.map((w) => (
              <div
                key={w.id}
                className="rounded-md bg-(--tpl-bg-tertiary)/20 shadow-sm p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircleHeart
                    strokeWidth={1.5}
                    className={cn("size-4", "text-(--tpl-text-secondary)")}
                  />
                  <p className="text-sm font-semibold text-(--tpl-text-secondary)/90">
                    {w.name}
                  </p>
                  {showCategory && w.category && (
                    <span className="text-[10px] uppercase tracking-wider text-(--tpl-text-tertiary)/50 border border-(--tpl-text-secondary)/20 rounded-full px-2 py-0.5">
                      {w.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-(--tpl-text-tertiary)/80 whitespace-pre-line pl-6">
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
                disabled={loadingWishes}
                className="text-xs uppercase tracking-widest bg-transparent border-(--tpl-text-primary)/20 text-(--tpl-text-primary) hover:bg-(--tpl-bg-tertiary)/30"
              >
                {loadingWishes ? "Memuat…" : "Muat lebih banyak"}
              </Button>
            </div>
          )}
        </motion.div>
      )} */}
    </section>
  );
}
