"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarCheck2,
  Loader2,
  MessageCircleHeart,
  Send,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useForm, useWatch, Controller, Control } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldSet,
} from "@/components/ui/field";
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
}

export function RSVPKalandra({
  publicToken,
  mode = "guest",
  guestSlug,
  guestName,
  inv,
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
  const isPreview = mode === "preview";

  const onSubmit = async (data: RsvpFormType) => {
    console.log("data: ", data);
    try {
      const result = await submitRsvp(publicToken, data, guestSlug);
      if (result.success) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Gagal mengirim rsvp, coba lagi beberapa saat.");
    }
  };

  return (
    <section
      id="rsvp"
      className="px-8 py-24 bg-(--tpl-bg-primary) relative overflow-hidden"
    >
      <BackgroundDecorations />

      <motion.div
        className="text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp(0)}
      >
        <h2 className="text-4xl mb-3 font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)">
          R.S.V.P
        </h2>
        <div className="w-12 h-px mx-auto mb-4 bg-(--tpl-text-tertiary)" />
        <p className="text-[10px] text-balance uppercase tracking-[0.2em] text-(--tpl-text-primary)/90">
          Kindly RSVP at your earliest convenience.
        </p>
      </motion.div>

      {isPreview && (
        <p className="text-center text-[10px] text-amber-500 tracking-widest uppercase mb-4 flex items-center justify-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Preview Mode · Form submission disabled
        </p>
      )}

      <motion.div
        className="max-w-md mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeUp(0.2)}
      >
        <FieldSet disabled={isSubmitting || isPreview}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <NameInput control={form.control} />
            <AttendanceInput control={form.control} themeStyle={themeStyle} />
            <WishesInput control={form.control} />
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
    </section>
  );
}

// --- EXTRACTED COMPONENTS ---

function BackgroundDecorations() {
  return (
    <>
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl bg-(--tpl-bg-tertiary)/5",
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 w-32 h-32 rounded-full -ml-16 -mb-16 blur-3xl bg-(--tpl-bg-secondary)/10",
        )}
      />
    </>
  );
}

function NameInput({ control }: { control: Control<RsvpFormType> }) {
  return (
    <Controller
      control={control}
      name="name"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor="name"
            className={cn(
              "text-[10px] uppercase tracking-widest ml-1 transition-colors",
              "text-(--tpl-text-primary)/80 group-focus-within:text-(--tpl-btn-bg-secondary)",
            )}
          >
            Nama
          </FieldLabel>
          <FieldContent>
            <div className="relative group">
              <User
                strokeWidth={1.5}
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 size-4 transition-colors",
                  "text-(--tpl-text-primary)/80 group-focus-within:text-(--tpl-btn-bg-secondary)",
                )}
              />
              <Input
                id="name"
                {...field}
                aria-invalid={fieldState.invalid}
                className={cn(
                  "w-full border-none text-sm py-6 pl-10 pr-4 rounded-md transition-all duration-300 shadow-sm",
                  "bg-(--tpl-bg-tertiary)/20 text-(--tpl-text-primary) placeholder:text-(--tpl-text-primary)/70 focus-visible:ring-2 focus-visible:ring-(--tpl-btn-bg-secondary)/20",
                )}
                placeholder="Nama Tamu"
              />
            </div>
          </FieldContent>
          {fieldState.invalid && (
            <FieldError
              className="ml-1 text-[10px]"
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
    />
  );
}

function AttendanceInput({
  control,
  themeStyle,
}: {
  control: Control<RsvpFormType>;
  themeStyle?: React.CSSProperties;
}) {
  const attendance = useWatch({ control, name: "response" });

  return (
    <>
      <Controller
        control={control}
        name="response"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="attendance"
              className={cn(
                "text-[10px] uppercase tracking-widest ml-1 transition-colors text-(--tpl-text-primary)/80 group-focus-within:text-(--tpl-btn-bg-secondary)",
              )}
            >
              Kehadiran
            </FieldLabel>
            <FieldContent className="group">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="attendance"
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "w-full border-none text-sm py-6 px-3 rounded-md transition-all duration-300 shadow-sm",
                    "bg-(--tpl-bg-tertiary)/20 text-(--tpl-text-primary) data-placeholder:text-(--tpl-text-primary)/70 focus:ring-2 focus:ring-(--tpl-btn-bg-secondary)/20",
                    "group-focus-within:text-(--tpl-btn-bg-secondary)",
                    "[&>svg]:transition-colors group-focus-within:[&>svg]:text-(--tpl-btn-bg-secondary)",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck2
                      strokeWidth={1.5}
                      className={cn(
                        "size-4 text-(--tpl-text-primary)/75",
                        "group-focus-within:text-(--tpl-btn-bg-secondary)",
                      )}
                    />
                    <SelectValue placeholder="Select status" />
                  </div>
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-full rounded-md p-1 shadow-xl "
                  style={themeStyle}
                >
                  <SelectItem
                    value="ACCEPT"
                    className="p-3 focus:bg-[#6b7c62]/10 rounded-sm"
                  >
                    <span className="font-(family-name:--tpl-font-body)">
                      Hadir
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="DECLINE"
                    className="p-3 focus:bg-[#6b7c62]/10 rounded-sm"
                  >
                    <span className="font-(family-name:--tpl-font-body)">
                      Tidak Bisa Hadir
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="MAYBE"
                    className="p-3 focus:bg-[#6b7c62]/10 rounded-sm"
                  >
                    <span className="font-(family-name:--tpl-font-body)">
                      Ragu-ragu
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
            {fieldState.invalid && (
              <FieldError
                className="ml-1 text-[10px]"
                errors={[
                  {
                    message:
                      fieldState.error?.message === "Required" ||
                      fieldState.error?.message?.includes("Invalid")
                        ? "Mohon pilih status kehadiran Anda"
                        : fieldState.error?.message,
                  },
                ]}
              />
            )}
          </Field>
        )}
      />

      {attendance === "ACCEPT" && (
        <Controller
          control={control}
          name="guests"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <FieldLabel
                className={cn(
                  "text-[10px] uppercase tracking-widest ml-1 transition-colors text-(--tpl-text-primary)/80 group-focus-within:text-(--tpl-btn-bg-secondary)",
                )}
              >
                Jumlah Tamu
              </FieldLabel>
              <FieldContent className="group">
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className={cn(
                      "w-full border-none text-sm py-6 px-3 rounded-md transition-all duration-300 shadow-sm",
                      "bg-(--tpl-bg-tertiary)/20 text-(--tpl-text-primary) data-placeholder:text-(--tpl-text-primary)/70 focus:ring-2 focus:ring-(--tpl-btn-bg-secondary)/20",
                      "group-focus-within:text-(--tpl-btn-bg-secondary)",
                      "[&>svg]:transition-colors group-focus-within:[&>svg]:text-(--tpl-btn-bg-secondary)",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Users
                        strokeWidth={1.5}
                        className={cn(
                          "size-4 transition-colors text-(--tpl-text-primary)/80",
                          "group-focus-within:text-(--tpl-btn-bg-secondary)",
                        )}
                      />
                      <SelectValue placeholder="Guests" />
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-full rounded-md p-1 shadow-xl font-montserrat"
                    style={themeStyle}
                  >
                    <SelectItem
                      value="1"
                      className="p-3 focus:bg-[#6b7c62]/10 rounded-sm"
                    >
                      <span className="font-(family-name:--tpl-font-body)">
                        1 Orang
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="2"
                      className="p-3 focus:bg-[#6b7c62]/10 rounded-sm"
                    >
                      <span className="font-(family-name:--tpl-font-body)">
                        2 Orang
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
              {fieldState.invalid && (
                <FieldError
                  className="ml-1 text-[10px]"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />
      )}
    </>
  );
}

function WishesInput({ control }: { control: Control<RsvpFormType> }) {
  return (
    <Controller
      control={control}
      name="wish"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor="wish"
            className={cn(
              "text-[10px] uppercase tracking-widest ml-1 transition-colors text-(--tpl-text-primary)/80 group-focus-within:text-(--tpl-btn-bg-secondary)",
            )}
          >
            Wishes & Messages
          </FieldLabel>
          <FieldContent>
            <div className="relative group">
              <MessageCircleHeart
                strokeWidth={1.5}
                className={cn(
                  "absolute left-3 top-4 size-4 transition-colors text-(--tpl-text-primary)/80 group-focus-within:text-(--tpl-btn-bg-secondary)",
                )}
              />
              <Textarea
                id="wish"
                {...field}
                aria-invalid={fieldState.invalid}
                rows={4}
                className={cn(
                  "w-full h-full border-none text-sm pt-3 pb-3 pl-10 pr-4 rounded-md transition-all duration-300 shadow-sm resize-none",
                  "bg-(--tpl-bg-tertiary)/20 text-(--tpl-text-primary) placeholder:text-(--tpl-text-primary)/70 focus-visible:ring-2 focus-visible:ring-(--tpl-btn-bg-secondary)/20",
                )}
                placeholder="Send your warm wishes to the couple..."
              />
            </div>
          </FieldContent>
          {fieldState.invalid && (
            <FieldError
              className="ml-1 text-[10px]"
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
    />
  );
}
