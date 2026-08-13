"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getPublicWishes } from "@/features/invitation/actions/get-public-wishes";
import { submitRsvp } from "@/features/invitation/actions/submit-rsvp";
import { RsvpSessionSelector } from "@/features/invitation/components/rsvp/rsvp-session-selector";
import {
  rsvpFormSchema,
  type RsvpFormType,
} from "@/features/invitation/schemas/rsvp.schema";
import type {
  InvitationState,
  PublicWish,
} from "@/features/invitation/types/invitation.type";
import type { TemplateMode } from "../types";
import {
  OURIFY_STANDARD_SECTION_CLASS,
  OurifySectionHeading,
} from "./ourify-motion";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

const PREVIEW_WISHES: PublicWish[] = OURIFY_REVIEW_PLACEHOLDERS.wishes.map(
  (wish, index) => ({
    ...wish,
    category: null,
    createdAt: new Date(`2026-01-0${index + 1}T00:00:00.000Z`),
  }),
);

const STATUS_LABELS: Record<NonNullable<PublicWish["response"]>, string> = {
  ACCEPT: "ATTENDING",
  MAYBE: "MAYBE",
  DECLINE: "NOT ATTENDING",
};

type OurifyRsvpAndWishesProps = {
  invitation: InvitationState;
  mode?: TemplateMode;
  guestSlug?: string;
  guestName?: string;
  sessions?: import("@/features/invitation/events/session.types").SessionOption[];
};

export function OurifyRsvpAndWishes({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
  sessions = [],
}: OurifyRsvpAndWishesProps) {
  const isDirectPreview =
    invitation.id === "preview" && invitation.publicToken === "preview";
  const isPreview = mode === "preview" || isDirectPreview;
  const wishesEnabled = invitation.wishesOptions?.enabled ?? true;
  const [wishes, setWishes] = useState<PublicWish[]>(
    isPreview && wishesEnabled ? PREVIEW_WISHES : [],
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingWishes, setLoadingWishes] = useState(false);
  const [failedPage, setFailedPage] = useState<number | null>(null);
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
  const wishLength =
    useWatch({
      control: form.control,
      name: "wish",
      defaultValue: "",
    })?.length ?? 0;
  const response = useWatch({ control: form.control, name: "response" });
  const eventIds = useWatch({ control: form.control, name: "eventIds" }) ?? [];

  useEffect(() => {
    if (response && response !== "ACCEPT") {
      form.setValue("eventIds", []);
    }
  }, [form, response]);
  const responseOptions = [
    {
      value: "ACCEPT",
      label: "ATTENDING",
      enabled: invitation.rsvpOptions.accept,
    },
    {
      value: "DECLINE",
      label: "NOT ATTENDING",
      enabled: invitation.rsvpOptions.decline,
    },
    {
      value: "MAYBE",
      label: "MAYBE",
      enabled: invitation.rsvpOptions.maybe,
    },
  ] as const;

  useEffect(() => {
    if (isPreview || !wishesEnabled) return;

    let cancelled = false;
    const loadInitialWishes = async () => {
      setLoadingWishes(true);
      const result = await getPublicWishes(invitation.publicToken, 1);
      if (cancelled) return;

      if (result.wishes) {
        setWishes(result.wishes);
        setPage(result.page);
        setTotalPages(result.totalPages);
      } else {
        setFailedPage(1);
        toast.error(result.errors?._form?.[0] || "Gagal memuat ucapan tamu.");
      }
      setLoadingWishes(false);
    };

    void loadInitialWishes();
    return () => {
      cancelled = true;
    };
  }, [invitation.publicToken, isPreview, wishesEnabled]);

  const onSubmit = async (data: RsvpFormType) => {
    try {
      const result = await submitRsvp(invitation.publicToken, data, guestSlug);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset({
        name: guestName ?? "",
        phoneNumber: "",
        response: undefined,
        guests: "1",
        wish: "",
        eventIds: [],
      });
    } catch {
      toast.error("Konfirmasi belum terkirim. Silakan coba lagi.");
    }
  };

  const loadPage = async (targetPage: number) => {
    setLoadingWishes(true);
    const result = await getPublicWishes(invitation.publicToken, targetPage);

    if (result.wishes) {
      setWishes(result.wishes);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setFailedPage(null);
    } else {
      setFailedPage(targetPage);
      toast.error(result.errors?._form?.[0] || "Gagal memuat ucapan.");
    }
    setLoadingWishes(false);
  };

  return (
    <section
      data-ourify-section="rsvp-wishes"
      aria-labelledby="ourify-rsvp-title"
      className={OURIFY_STANDARD_SECTION_CLASS}
    >
      <OurifySectionHeading id="ourify-rsvp-title" eyebrow="Guestlist">
        RSVP &amp; Wishes
      </OurifySectionHeading>

      {isPreview ? (
        <p className="sr-only">Mode preview - formulir dinonaktifkan</p>
      ) : null}

      <form
        data-testid="ourify-rsvp-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-7 rounded-[10px] bg-[#222222] px-[18px] py-5"
      >
        <FieldSet disabled={isPreview || form.formState.isSubmitting}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ourify-rsvp-name">NAME</FieldLabel>
                  <Input
                    {...field}
                    id="ourify-rsvp-name"
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                    className="border-white/10 bg-[#282828] text-white placeholder:text-[#8f8f8f]"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="response"
              render={({ field, fieldState }) => (
                <FieldSet>
                  <FieldLegend variant="label">CONFIRM ATTENDANCE</FieldLegend>
                  <RadioGroup
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    aria-label="CONFIRM ATTENDANCE"
                    aria-invalid={fieldState.invalid}
                    className="flex flex-nowrap gap-2"
                  >
                    {responseOptions.map(({ value, label, enabled }) =>
                      enabled ? (
                        <Field
                          key={value}
                          orientation="horizontal"
                          className="w-auto min-w-0 justify-center rounded-full border border-white/15 px-3 py-2"
                        >
                          <RadioGroupItem
                            id={`ourify-response-${value.toLowerCase()}`}
                            value={value}
                          />
                          <FieldLabel
                            htmlFor={`ourify-response-${value.toLowerCase()}`}
                            className="truncate text-[9px] tracking-[-0.02em]"
                          >
                            {label}
                          </FieldLabel>
                        </Field>
                      ) : null,
                    )}
                  </RadioGroup>
                  <FieldError errors={[fieldState.error]} />
                </FieldSet>
              )}
            />

            <Controller
              control={form.control}
              name="wish"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ourify-rsvp-wish">
                    WISHES &amp; PRAYERS
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="ourify-rsvp-wish"
                    maxLength={1000}
                    rows={4}
                    placeholder="Write your wishes and prayers"
                    aria-invalid={fieldState.invalid}
                    className="border-white/10 bg-[#282828] text-white placeholder:text-[#8f8f8f]"
                  />
                  <p className="text-right text-[10px] text-[#8f8f8f]">
                    {wishLength}/1000
                  </p>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

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
              size="lg"
              disabled={isPreview || form.formState.isSubmitting}
              aria-label="SEND WISHES"
              className="w-full rounded-full bg-(--tpl-text-tertiary) text-[11px] font-extrabold tracking-[0.08em] text-[#121212] hover:bg-(--tpl-text-tertiary)/90 disabled:opacity-100"
            >
              {form.formState.isSubmitting ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : null}
              {form.formState.isSubmitting ? "SENDING..." : "SEND WISHES"}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>

      {wishesEnabled ? (
        <div className="mt-14">
          <h2 className="text-[22px] font-extrabold tracking-[-0.03em]">
            Wishes
          </h2>
          <div className="mt-5 border-t border-white/10">
            {wishes.length > 0 ? (
              wishes.map((wish) => (
                <article
                  key={wish.id}
                  className="flex gap-3 border-b border-white/10 py-4"
                >
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="bg-[#282828] text-sm font-bold text-(--tpl-text-tertiary)">
                      {wish.name.trim().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[13px] font-bold">
                      {wish.name}
                    </h3>
                    {wish.response ? (
                      <Badge
                        variant="outline"
                        className="mt-1 rounded-full border-(--tpl-text-tertiary) bg-transparent text-[8px] tracking-[0.06em] text-(--tpl-text-tertiary)"
                      >
                        {STATUS_LABELS[wish.response]}
                      </Badge>
                    ) : null}
                    <p className="mt-2 break-words text-[12px] leading-5 text-[#b3b3b3]">
                      {wish.wish}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <p className="py-5 text-[12px] text-[#b3b3b3]">
                {loadingWishes
                  ? "Memuat pesan tamu..."
                  : "Belum ada pesan. Jadilah yang pertama."}
              </p>
            )}
          </div>

          {!isPreview ? (
            <div className="mt-5 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Halaman ucapan sebelumnya"
                disabled={loadingWishes || page <= 1}
                onClick={() => void loadPage(page - 1)}
                className="rounded-full text-white hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <p className="text-[11px] text-[#b3b3b3]">
                Page {page} of {totalPages}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Muat ucapan berikutnya"
                disabled={loadingWishes || page >= totalPages}
                onClick={() => void loadPage(page + 1)}
                className="rounded-full text-white hover:bg-white/10 hover:text-white"
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          ) : null}
          {failedPage !== null ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadPage(failedPage)}
              className="mt-3 w-full rounded-full border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Coba lagi memuat ucapan
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
