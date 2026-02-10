import type { TFunction } from "i18next";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import type { ApiError } from "../types";

export function setServerErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
  t?: TFunction,
) {
  const apiError: ApiError = error?.response?.data || error;

  if (apiError?.errors && Array.isArray(apiError.errors)) {
    apiError.errors.forEach((err) => {
      if (err.field && err.code) {
        const translationKey = `serverErrors.${err.code}`;
        const message = t ? t(translationKey) : err.code;
        const finalMessage = message === translationKey ? err.code : message;
        setError(err.field as FieldPath<T>, {
          type: "server",
          message: finalMessage,
        });
      }
    });
  } else if (apiError?.code) {
    const translationKey = `serverErrors.${apiError.code}`;
    const message = t ? t(translationKey) : apiError.code;
    const finalMessage = message === translationKey ? apiError.code : message;
    setError("root" as FieldPath<T>, {
      type: "server",
      message: finalMessage,
    });
  } else {
    const message = t
      ? t("common.unexpectedError")
      : "An unexpected error occurred";
    setError("root" as FieldPath<T>, {
      type: "server",
      message,
    });
  }
}
