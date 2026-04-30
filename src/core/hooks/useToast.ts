import { toast } from "@heroui/react";
import { useTranslation } from "react-i18next";

/**
 * Thin wrapper around HeroUI toast with i18n support.
 *
 * showSuccess / showWarning / showInfo accept i18n keys.
 * showError accepts either an i18n key OR a raw message string —
 * it tries to translate first, and falls back to the raw value if
 * no translation exists. This lets it work with both:
 *   showError("serverErrors.NOT_FOUND")   // translated key
 *   showError(getErrorMessage(err, t))    // already-translated string
 */
export function useToast() {
  const { t } = useTranslation();

  const showSuccess = (messageKey: string) => {
    toast.success(t(messageKey));
  };

  const showError = (messageOrKey: string) => {
    const translated = t(messageOrKey);
    // If the key has no translation, t() returns the key itself — use the raw value
    toast.danger(translated !== messageOrKey ? translated : messageOrKey);
  };

  const showWarning = (messageKey: string) => {
    toast.warning(t(messageKey));
  };

  const showInfo = (messageKey: string) => {
    toast.info(t(messageKey));
  };

  return { showSuccess, showError, showWarning, showInfo };
}
