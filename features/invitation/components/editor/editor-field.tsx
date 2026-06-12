"use client";

import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Notion-clean editor controls referenced from the "Knot" design.
 * Filled muted background, transparent border that gains the ring + surface
 * fill on focus — implemented on top of the shadcn primitives so they keep
 * the app's theme tokens, focus states, and a11y behaviour.
 */
const editorControlClass =
  "h-auto rounded-md border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none transition-colors hover:bg-muted focus-visible:bg-background";

function EditorField({
  className,
  ...props
}: React.ComponentProps<typeof Field>) {
  return <Field className={cn("gap-1.5", className)} {...props} />;
}

function EditorLabel({
  className,
  ...props
}: React.ComponentProps<typeof FieldLabel>) {
  return (
    <FieldLabel
      className={cn(
        "text-[10.5px] font-medium tracking-[0.04em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

function EditorInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return <Input className={cn(editorControlClass, className)} {...props} />;
}

function EditorTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      className={cn(
        editorControlClass,
        "min-h-15 resize-y leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

function EditorHint({
  className,
  ...props
}: React.ComponentProps<typeof FieldDescription>) {
  return (
    <FieldDescription
      className={cn("text-[10.5px]", className)}
      {...props}
    />
  );
}

/** Inline publish-validation error built on top of shadcn `FieldError`. */
function EditorError({
  errors,
  className,
  ...props
}: Omit<React.ComponentProps<typeof FieldError>, "errors"> & {
  errors?: string[];
}) {
  if (!errors?.length) return null;
  return (
    <FieldError
      className={cn("text-[10.5px]", className)}
      errors={errors.map((message) => ({ message }))}
      {...props}
    />
  );
}

export {
  EditorField,
  EditorLabel,
  EditorInput,
  EditorTextarea,
  EditorHint,
  EditorError,
};
