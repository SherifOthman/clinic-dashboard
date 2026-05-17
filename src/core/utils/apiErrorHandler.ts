import type { TFunction } from "i18next";

export function getErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof Error) {
    const e = error as any;
    if (e.code === "ACCOUNT_LOCKED" && e.detail) return e.detail;
    if (e.code === "RATE_LIMITED") return t("errors.rateLimited");
    if (e.code) {
      const key = `serverErrors.${e.code}`;
      const translated = t(key);
      return translated !== key ? translated : (e.detail ?? e.code);
    }
    if (e.detail) return e.detail;
    if (error.message && error.message !== "Unauthorized" && error.message !== "Forbidden")
      return error.message;
  }
  return t("common.unexpectedError");
}
