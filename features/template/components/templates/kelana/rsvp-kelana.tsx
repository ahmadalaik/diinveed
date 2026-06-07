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
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { FieldSet } from "@/components/ui/field";
import {
  rsvpFormSchema,
  RsvpFormType,
} from "@/features/invitation/schemas/rsvp.schema";
import { submitRsvp } from "@/features/invitation/actions/submit-rsvp";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  token: string;
  mode?: "preview" | "guest";
}

export function RSVPKelana({ token, mode }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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
      name: "",
      phoneNumber: "",
      response: "ACCEPT",
      guests: "1",
      hope: "",
    },
  });

  const isPreview = mode === "preview";

  const attendance = useWatch({
    control,
    name: "response",
  });

  const onSubmit = async (data: RsvpFormType) => {
    console.log("data: ", data);
    try {
      const result = await submitRsvp(token, data);
      if (result.success) {
        toast.success("Rsvp berhasil dikirim");
        reset();
      } else {
        toast.error(result.errors._form);
      }
    } catch {
      toast.error("Gagal mengirim rsvp, coba lagi beberapa saat.");
    }
  };

  return (
    <section
      ref={ref}
      id="rsvp"
      className="px-8 py-24 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6b7c62]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4cbb3]/10 rounded-full -ml-16 -mb-16 blur-3xl" />

      <motion.div
        className="text-center mb-12"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <h2 className="font-serif text-4xl text-[#2c2c2c] mb-3">R.S.V.P</h2>
        <div className="w-12 h-px bg-[#6b7c62] mx-auto mb-4" />
        <p className="text-[10px] text-stone-500 text-balance uppercase tracking-[0.2em]">
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
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp(0.2)}
      >
        <FieldSet
          disabled={isPreview}
          className="border-0 m-0 p-0 disabled:opacity-60"
        >
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2 group">
              <Label
                htmlFor="name"
                className="text-[10px] uppercase tracking-widest text-stone-500 ml-1 transition-colors group-focus-within:text-[#6b7c62]"
              >
                Guest Name
              </Label>
              <div className="relative">
                <User
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400 group-focus-within:text-[#6b7c62] transition-colors"
                />
                <Input
                  id="name"
                  {...register("name")}
                  className="w-full bg-[#f9f7f2] border-none text-sm py-6 pl-10 pr-4 rounded-md text-stone-700 placeholder:text-stone-300 focus-visible:ring-2 focus-visible:ring-[#6b7c62]/20 transition-all duration-300 shadow-sm"
                  placeholder="Full name as on invitation"
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2 group">
              <Label className="text-[10px] uppercase tracking-widest text-stone-500 ml-1 transition-colors group-focus-within:text-[#6b7c62]">
                Attendance
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue("response", val as "ACCEPT" | "DECLINE" | "MAYBE", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  className="w-full bg-[#f9f7f2] border-none text-sm py-6 px-3 rounded-md text-stone-700 data-placeholder:text-stone-300 focus:ring-2 focus:ring-[#6b7c62]/20 transition-all duration-300 shadow-sm"
                  disabled={isSubmitting || isPreview}
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck2
                      strokeWidth={1.5}
                      className="size-4 text-stone-400"
                    />
                    <SelectValue placeholder="Select status" />
                  </div>
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="rounded-md bg-[#fcfbf9] border-[#f4f1ea] shadow-xl"
                >
                  <SelectItem
                    value="yes"
                    className="py-3 px-3 focus:bg-[#6b7c62]/10 rounded-sm"
                  >
                    Joyfully Attend
                  </SelectItem>
                  <SelectItem
                    value="no"
                    className="py-3 px-3 focus:bg-[#6b7c62]/10 rounded-sm"
                  >
                    Regretfully Decline
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.response && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.response.message}
                </p>
              )}
            </div>

            {attendance === "ACCEPT" && (
              <div className="space-y-2 group animate-in fade-in slide-in-from-top-2 duration-300">
                <Label className="text-[10px] uppercase tracking-widest text-stone-500 ml-1 transition-colors group-focus-within:text-[#6b7c62]">
                  Number of Guests
                </Label>
                <Select
                  defaultValue="1"
                  onValueChange={(val) =>
                    setValue("guests", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    className="w-full bg-[#f9f7f2] border-none text-sm py-6 px-3 rounded-md text-stone-700 data-placeholder:text-stone-300 focus:ring-2 focus:ring-[#6b7c62]/20 transition-all duration-300 shadow-sm"
                    disabled={isSubmitting || isPreview}
                  >
                    <div className="flex items-center gap-3">
                      <Users
                        strokeWidth={1.5}
                        className="size-4 text-stone-400"
                      />
                      <SelectValue placeholder="Guests" />
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="rounded-md border-[#f4f1ea] shadow-xl"
                  >
                    <SelectItem
                      value="1"
                      className="py-3 px-3 focus:bg-[#6b7c62]/10 rounded-sm"
                    >
                      1 Person
                    </SelectItem>
                    <SelectItem
                      value="2"
                      className="py-3 px-3 focus:bg-[#6b7c62]/10 rounded-sm"
                    >
                      2 Persons
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2 group">
              <Label
                htmlFor="hope"
                className="text-[10px] uppercase tracking-widest text-stone-500 ml-1 transition-colors group-focus-within:text-[#6b7c62]"
              >
                Wishes & Messages
              </Label>
              <div className="relative">
                <MessageCircleHeart
                  strokeWidth={1.5}
                  className="absolute left-3 top-4 size-4 text-stone-400 group-focus-within:text-[#6b7c62] transition-colors"
                />
                <Textarea
                  id="hope"
                  {...register("hope")}
                  rows={4}
                  className="w-full h-full bg-[#f9f7f2] border-none text-sm pt-3 pb-3 pl-10 pr-4 rounded-md text-stone-700 placeholder:text-stone-300 focus-visible:ring-2 focus-visible:ring-[#6b7c62]/20 transition-all duration-300 shadow-sm resize-none"
                  placeholder="Send your warm wishes to the couple..."
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isPreview}
              className="w-full bg-[#2c2c2c] hover:bg-[#6b7c62] text-white mt-2 py-6 rounded-md text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-lg hover:shadow-[#6b7c62]/20 active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    Sending...
                    <Loader2 className="size-3 animate-spin" />
                  </>
                ) : (
                  <>
                    Send RSVP
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
