import { AxiosError } from "axios";
import type { TFunction } from "i18next";

import type { ApiProblemDetails } from "../types";

/**
 * Extracts a human-readable, translated error message from an API error.
 *
 * The backend returns RFC 7807 ProblemDetails with an optional `code` field
 * (e.g. "ACCOUNT_LOCKED", "EMAIL_ALREADY_EXISTS"). We translate those codes
 * via the `serverErrors.*` i18n namespace.
 *
 * Priority:
 *   1. ACCOUNT_LOCKED with a detail message → use detail directly
 *      (it contains dynamic info like "locked for 5 more minutes")
 *   2. Known error code → translate via serverErrors.{code}
 *   3. detail field → use as-is
 *   4. Fallback → generic "unexpected error" message
 */
export function getErrorMessage(error: unknown, t: TFunction): string {
  const axiosError = error as AxiosError<ApiProblemDetails>;
  const errorData = axiosError.response?.data;

  if (!errorData) {
    return t("common.unexpectedError");
  }

  if (errorData.code === "ACCOUNT_LOCKED" && errorData.detail) {
    return errorData.detail;
  }

  if (errorData.code) {
    const translationKey = `serverErrors.${errorData.code}`;
    const translated = t(translationKey);
    // If the key wasn't found, t() returns the key itself — fall back to detail
    return translated !== translationKey
      ? translated
      : (errorData.detail ?? errorData.code);
  }

  return errorData.detail || t("common.unexpectedError");
}

/**
 * Returns an onError handler for React Query mutations.
 * Passes the translated error message to the toast system.
 *
 * Usage:
 *   useMutation({ onError: createErrorHandler(showError, t) })
 */
export function createErrorHandler(
  showError: (message: string) => void,
  t: TFunction,
) {
  return (error: unknown) => {
    const message = getErrorMessage(error, t);
    showError(message);
  };
}
