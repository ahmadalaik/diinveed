import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RsvpFormType } from "@/features/invitation/schemas/rsvp.schema";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<RsvpFormType>;
}

export function RsvpNameInput({ control }: Props) {
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
              "text-(--tpl-text-secondary)/80",
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
                  "text-(--tpl-text-secondary)/80 group-focus-within:text-(--tpl-btn-bg-secondary)",
                )}
              />
              <Input
                id="name"
                {...field}
                aria-invalid={fieldState.invalid}
                className={cn(
                  "w-full border-none text-sm py-6 pl-10 pr-4 rounded-md transition-all duration-300 shadow-sm",
                  "bg-(--tpl-bg-tertiary)/20 text-(--tpl-text-tertiary) placeholder:text-(--tpl-text-secondary)/70 focus-visible:ring-2 focus-visible:ring-(--tpl-btn-bg-secondary)/20",
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
