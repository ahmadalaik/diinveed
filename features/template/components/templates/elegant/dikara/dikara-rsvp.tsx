"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useForm, useWatch } from "react-hook-form";
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
  dikaraTokens,
  templateCssVars,
  mergeTemplateTokenOverrides,
} from "@/features/template/tokens";
import Image from "next/image";
import { DikaraWishes } from "./dikara-wishes";
import { useEffect, useRef } from "react";
import { BackgroundDecorations } from "./rsvp/background-decorations";
import { NameInput } from "./rsvp/name-input";
import { AttendanceInput } from "./rsvp/attendance-input";
import { WishesInput } from "./rsvp/wishes-input";
import { RsvpSessionSelector } from "@/features/invitation/components/rsvp/rsvp-session-selector";
import type { SessionOption } from "@/features/invitation/events/session.types";

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
  sessions?: SessionOption[];
}

export function DikaraRsvp({
  publicToken,
  mode = "guest",
  guestSlug,
  guestName,
  inv,
  sessions = [],
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const themeStyle = inv
    ? templateCssVars(
        mergeTemplateTokenOverrides(dikaraTokens, inv.tokenOverrides),
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
      eventIds: [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;
  const isPreview = mode === "preview";
  const response = useWatch({ control: form.control, name: "response" });
  const eventIds = useWatch({ control: form.control, name: "eventIds" }) ?? [];

  useEffect(() => {
    if (response && response !== "ACCEPT") {
      form.setValue("eventIds", []);
    }
  }, [form, response]);

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
      ref={sectionRef}
      id="rsvp"
      className="px-8 py-24 relative overflow-hidden snap-start"
    >
      <div className="absolute inset-0 bg-black/50 -z-10" />
      {inv?.coverMobileImage && (
        <Image
          src={inv.coverMobileImage}
          alt="RSVP Background"
          fill
          sizes="100vw"
          quality={80}
          className="object-cover -z-20"
        />
      )}
      <BackgroundDecorations />

      <motion.div
        className="text-center mb-12"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0.15)}
      >
        <h2 className="text-4xl mb-3 font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)">
          R.S.V.P
        </h2>
        <div className="w-12 h-px mx-auto mb-4 bg-(--tpl-text-tertiary)" />
        <p className="text-[10px] text-balance tracking-[0.2em] text-(--tpl-text-tertiary)/90">
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
        className="max-w-md mx-auto"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0.35)}
      >
        <FieldSet disabled={isSubmitting || isPreview}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <NameInput control={form.control} />
            <AttendanceInput control={form.control} themeStyle={themeStyle} />
            <WishesInput control={form.control} />
            {response === "ACCEPT" ? (
              <RsvpSessionSelector
                sessions={sessions}
                value={eventIds}
                onChange={(value) =>
                  form.setValue("eventIds", value, { shouldValidate: true })
                }
                error={form.formState.errors.eventIds?.message}
              />
            ) : null}
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

      {(inv?.wishesOptions?.enabled ?? true) && (
        <div className="mt-16 relative z-10 w-full mx-auto">
          <DikaraWishes
            publicToken={publicToken}
            showCategory={inv?.wishesOptions?.showCategory ?? false}
            mode={mode}
          />
        </div>
      )}
    </section>
  );
}
