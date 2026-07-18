import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { RsvpFormType } from "@/features/invitation/schemas/rsvp.schema";
import { cn } from "@/lib/utils";
import { MessageCircleHeart } from "lucide-react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<RsvpFormType>;
}

export function RsvpWishesInput({ control }: Props) {
  return (
    <Controller
      control={control}
      name="wish"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor="wish"
            className="text-[10px] uppercase tracking-widest ml-1 transition-colors text-(--tpl-text-primary)/80 group-focus-within:text-(--tpl-btn-bg-secondary)"
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
