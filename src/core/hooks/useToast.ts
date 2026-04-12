import { toast } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function useToast() {
  const { t } = useTranslation();

  const showSuccess = (messageKey: string) => {
    toast.success(t(messageKey));
  };

  const showError = (messageKey: string) => {
    toast.danger(t(messageKey));
  };

  const showWarning = (messageKey: string) => {
    toast.warning(t(messageKey));
  };

  const showInfo = (messageKey: string) => {
    toast.info(t(messageKey));
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
