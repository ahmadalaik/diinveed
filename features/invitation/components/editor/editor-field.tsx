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

type EditorFieldProps = React.ComponentProps<typeof Field> & {
  publishField?: string;
  invalid?: boolean;
};

function EditorField({
  className,
  publishField,
  invalid,
  ...props
}: EditorFieldProps) {
  return (
    <Field
      className={cn("gap-1.5", className)}
      data-publish-field={publishField}
      data-invalid={invalid || undefined}
      {...props}
    />
  );
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

type EditorControlValidationProps = {
  publishField?: string;
  invalid?: boolean;
};

function EditorInput({
  className,
  publishField,
  invalid,
  "aria-invalid": ariaInvalid,
  ...props
}: React.ComponentProps<typeof Input> & EditorControlValidationProps) {
  return (
    <Input
      className={cn(editorControlClass, className)}
      data-publish-field={publishField}
      aria-invalid={ariaInvalid ?? invalid}
      {...props}
    />
  );
}

function EditorTextarea({
  className,
  publishField,
  invalid,
  "aria-invalid": ariaInvalid,
  ...props
}: React.ComponentProps<typeof Textarea> & EditorControlValidationProps) {
  return (
    <Textarea
      className={cn(
        editorControlClass,
        "min-h-15 resize-y leading-relaxed",
        className,
      )}
      data-publish-field={publishField}
      aria-invalid={ariaInvalid ?? invalid}
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
