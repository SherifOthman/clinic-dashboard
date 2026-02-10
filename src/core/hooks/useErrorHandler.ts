import { logger } from "@/core/services/logger";
import { useTranslation } from "react-i18next";

import type { ApiError } from "../types";
import { useToast } from "./useToast";

export function useErrorHandler() {
  const { t } = useTranslation();
  const { showError, showSuccess } = useToast();

  const handleError = (
    error: any,
    fallbackMessageKey = "common.unexpectedError",
  ) => {
    logger.error(
      "Error handled by useErrorHandler",
      {
        error: error?.message || error,
        stack: error?.stack,
        response: error?.response?.data,
      },
      "ErrorHandler",
    );

    let messageKey = fallbackMessageKey;

    if (error?.response?.data?.message) {
      messageKey = error.response.data.message;
    } else if (error?.message) {
      messageKey = error.message;
    }

    // Try to use as translation key first, fallback to direct message
    const translatedMessage = t(messageKey);
    if (translatedMessage !== messageKey) {
      showError(messageKey);
    } else {
      showError(fallbackMessageKey);
    }
  };

  const handleSuccess = (messageKey: string) => {
    logger.info("Success message displayed", { messageKey }, "ErrorHandler");
    showSuccess(messageKey);
  };

  const handleApiError = (
    error: ApiError,
    fallbackMessageKey = "common.unexpectedError",
  ) => {
    logger.error("API error handled", { error }, "ErrorHandler");
    const messageKey = error.message || fallbackMessageKey;

    // Try to use as translation key first, fallback to direct message
    const translatedMessage = t(messageKey);
    if (translatedMessage !== messageKey) {
      showError(messageKey);
    } else {
      showError(fallbackMessageKey);
    }
  };

  return {
    handleError,
    handleSuccess,
    handleApiError,
  };
}
