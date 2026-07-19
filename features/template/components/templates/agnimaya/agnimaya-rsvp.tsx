"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitRsvp } from "@/features/invitation/actions/submit-rsvp";
import {
  rsvpFormSchema,
  RsvpFormType,
} from "@/features/invitation/schemas/rsvp.schema";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

const inputClass =
  "w-full bg-camel/5 border border-transparent px-5 py-2.5 h-auto rounded-xl text-(--tpl-text-primary) focus-visible:ring-0 focus-visible:border-rosegold focus:outline-none placeholder:text-(--tpl-text-secondary)/40 text-base font-(family-name:--tpl-font-heading) transition-[color,background-color,border-color,box-shadow] duration-200 shadow-sm";

const labelClass =
  "block text-[10px] font-(family-name:--tpl-font-body) uppercase tracking-[0.2em] text-(--tpl-text-secondary) mb-3 ml-2 transition-colors group-focus-within:text-(--tpl-text-tertiary)";

interface Props {
  publicToken: string;
  mode?: "preview" | "guest";
  guestSlug?: string;
  guestName?: string;
}

export function RSVPAgnimaya({ publicToken, mode, guestSlug, guestName }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const isPreview = mode === "preview";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormType>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: guestName ?? "",
      phoneNumber: "",
      response: "ACCEPT",
      guests: "1",
      wish: "",
    },
  });

  const attendance = useWatch({ control, name: "response" });

  const onSubmit = async (data: RsvpFormType) => {
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
    <section ref={ref} id="rsvp" className="px-8 py-24 bg-(--tpl-bg-primary)">
      <div className="border border-rosegold/30 bg-(--tpl-bg-secondary)/10 p-8 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0)}
        >
          <h2 className="text-4xl font-(family-name:--tpl-font-heading) font-light text-(--tpl-text-primary) mb-3">
            R.S.V.P
          </h2>
          <div className="w-12 h-px bg-rosegold mx-auto mb-4" />
          <p className="text-(--tpl-text-secondary) font-(family-name:--tpl-font-body) text-[10px] tracking-[0.3em] uppercase">
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
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.2)}
        >
          <FieldSet
            disabled={isPreview}
            className="border-0 m-0 p-0 disabled:opacity-60"
          >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 group">
                <Label htmlFor="name" className={labelClass}>
                  Guest Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Full name as on invitation"
                  className={inputClass}
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500 ml-2 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 group">
                <Label className={labelClass}>Attendance</Label>
                <Select
                  onValueChange={(val) =>
                    setValue(
                      "response",
                      val as "ACCEPT" | "DECLINE" | "MAYBE",
                      {
                        shouldValidate: true,
                      },
                    )
                  }
                >
                  <SelectTrigger
                    className="w-full h-auto! bg-camel/5 border border-transparent px-5 py-2.5 rounded-xl text-(--tpl-text-primary) focus:ring-0 focus:border-rosegold data-placeholder:text-(--tpl-text-secondary)/40 text-base font-(family-name:--tpl-font-heading) shadow-sm"
                    disabled={isPreview}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="rounded-xl bg-(--tpl-bg-primary) border border-(--tpl-bg-tertiary)/10 shadow-xl mt-0.5"
                  >
                    <SelectItem
                      value="ACCEPT"
                      className="py-2.5 px-5 focus:bg-camel/10 text-(--tpl-text-primary) font-(family-name:--tpl-font-heading) cursor-pointer rounded-lg text-base"
                    >
                      Joyfully Attend
                    </SelectItem>
                    <SelectItem
                      value="DECLINE"
                      className="py-2.5 px-5 focus:bg-camel/10 text-(--tpl-text-primary) font-(family-name:--tpl-font-heading) cursor-pointer rounded-lg text-base"
                    >
                      Regretfully Decline
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.response && (
                  <p className="text-[10px] text-red-500 ml-2 mt-1">
                    {errors.response.message}
                  </p>
                )}
              </div>

              {attendance === "ACCEPT" && (
                <div className="space-y-2 group animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className={labelClass}>Number of Guests</Label>
                  <Select
                    defaultValue="1"
                    onValueChange={(val) =>
                      setValue("guests", val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      className="w-full h-auto! bg-camel/5 border border-transparent px-5 py-2.5 rounded-xl text-(--tpl-text-primary) focus:ring-0 focus:border-rosegold data-placeholder:text-(--tpl-text-secondary)/40 text-base font-(family-name:--tpl-font-heading) shadow-sm"
                      disabled={isPreview}
                    >
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="rounded-xl bg-(--tpl-bg-primary) border border-(--tpl-bg-tertiary)/10 shadow-xl mt-0.5"
                    >
                      <SelectItem
                        value="1"
                        className="py-2.5 px-5 focus:bg-camel/10 text-(--tpl-text-primary) font-(family-name:--tpl-font-heading) cursor-pointer rounded-lg text-base"
                      >
                        1 Person
                      </SelectItem>
                      <SelectItem
                        value="2"
                        className="py-2.5 px-5 focus:bg-camel/10 text-(--tpl-text-primary) font-(family-name:--tpl-font-heading) cursor-pointer rounded-lg text-base"
                      >
                        2 Persons
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2 group">
                <Label htmlFor="wish" className={labelClass}>
                  Wishes & Messages
                </Label>
                <Textarea
                  id="wish"
                  {...register("wish")}
                  rows={4}
                  placeholder="Send your warm wishes to the couple..."
                  className="w-full bg-camel/5 border border-transparent px-5 py-2.5 rounded-xl text-(--tpl-text-primary) focus-visible:ring-0 focus-visible:border-rosegold placeholder:text-(--tpl-text-secondary)/40 text-base font-(family-name:--tpl-font-heading) shadow-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isPreview}
                className="w-full py-7 rounded-full bg-(--tpl-bg-secondary) text-(--tpl-text-primary) mt-4 font-(family-name:--tpl-font-body) font-normal uppercase text-xs tracking-[0.2em] hover:bg-gold hover:text-white transition-all duration-500 shadow-lg active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      Sending...
                      <Loader2
                        strokeWidth={1.5}
                        className="size-4 animate-spin"
                      />
                    </>
                  ) : (
                    <>
                      Send RSVP
                      <Send
                        strokeWidth={1.5}
                        className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </FieldSet>
        </motion.div>
      </div>
    </section>
  );
}
