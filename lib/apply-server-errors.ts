import type { FieldValues, UseFormSetError, Path } from "react-hook-form";

export function applyServerErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Record<string, string[]> | undefined,
) {
  if (!errors) return;
  for (const key in errors) {
    const msg = errors[key]?.[0];
    if (msg) setError(key as Path<T>, { type: "server", message: msg });
  }
}
