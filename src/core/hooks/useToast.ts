import { addToast } from "@heroui/toast";
import { useTranslation } from "react-i18next";

export function useToast() {
  const { t } = useTranslation();

  const showSuccess = (messageKey: string, options?: { title?: string }) => {
    addToast({
      title: options?.title || t("common.success"),
      description: t(messageKey),
      color: "success",
      variant: "flat",
    });
  };

  const showError = (messageKey: string, options?: { title?: string }) => {
    addToast({
      title: options?.title || t("common.error"),
      description: t(messageKey),
      color: "danger",
      variant: "flat",
    });
  };

  const showWarning = (messageKey: string, options?: { title?: string }) => {
    addToast({
      title: options?.title || "Warning",
      description: t(messageKey),
      color: "warning",
      variant: "flat",
    });
  };

  const showInfo = (messageKey: string, options?: { title?: string }) => {
    addToast({
      title: options?.title || "Info",
      description: t(messageKey),
      color: "primary",
      variant: "flat",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
