export type ActionResponse<T = null> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export const ACTION_MESSAGES = {
  UNAUTHORIZED: "Anda tidak memiliki akses untuk tindakan ini",
  VALIDATION: "Periksa kembali isian Anda",
  SERVER_ERROR: "Terjadi kesalahan, silakan coba lagi",
} as const;

export function ok(message: string): ActionResponse;
export function ok<T>(message: string, data: T): ActionResponse<T>;
export function ok<T>(message: string, data?: T): ActionResponse<T> {
  return { success: true, message, data };
}

export function fail(
  message: string,
  errors?: Record<string, string[]>,
): ActionResponse<never> {
  return { success: false, message, errors };
}

export function validationError(
  error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } },
  message: string = ACTION_MESSAGES.VALIDATION,
): ActionResponse<never> {
  const fieldErrors = error.flatten().fieldErrors;
  const errors: Record<string, string[]> = {};
  for (const key in fieldErrors) {
    const v = fieldErrors[key];
    if (v && v.length) errors[key] = v;
  }
  return { success: false, message, errors };
}
