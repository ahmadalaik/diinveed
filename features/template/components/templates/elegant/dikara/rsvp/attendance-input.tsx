import { Control, Controller, useWatch } from "react-hook-form";
import { CalendarCheck2, Users } from "lucide-react";
import { RsvpFormType } from "@/features/invitation/schemas/rsvp.schema";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface AttendanceInputProps {
  control: Control<RsvpFormType>;
  themeStyle?: CSSProperties;
}

export function AttendanceInput({ control, themeStyle }: AttendanceInputProps) {
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
                "text-[10px] uppercase tracking-widest ml-1 transition-colors text-(--tpl-text-primary)/90 group-focus-within:text-(--tpl-btn-bg-secondary)",
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
                    "bg-(--tpl-bg-tertiary)/20 text-(--tpl-text-primary) data-placeholder:text-(--tpl-text-primary)/80 focus:ring-2 focus:ring-(--tpl-btn-bg-secondary)/20",
                    "group-focus-within:text-(--tpl-btn-bg-secondary)",
                    "[&>svg]:transition-colors group-focus-within:[&>svg]:text-(--tpl-btn-bg-secondary)",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck2
                      strokeWidth={1.5}
                      className={cn(
                        "size-4 text-(--tpl-text-primary)/90",
                        "group-focus-within:text-(--tpl-btn-bg-secondary)",
                      )}
                    />
                    <SelectValue placeholder="Konfirmasi Kehadiran" />
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
                  "text-[10px] uppercase tracking-widest ml-1 transition-colors text-(--tpl-text-primary)/90 group-focus-within:text-(--tpl-btn-bg-secondary)",
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
                          "size-4 transition-colors text-(--tpl-text-primary)/90",
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
