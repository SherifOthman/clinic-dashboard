import { Alert } from "@heroui/react";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getErrorMessage } from "@/core/utils/apiErrorHandler";

interface ErrorMessageProps {
  message?: string;
  error?: any;
  showIcon?: boolean;
}

export function ErrorMessage({
  message,
  error,
  showIcon = true,
}: ErrorMessageProps) {
  const { t } = useTranslation();

  let displayMessage = message;

  if (error) {
    displayMessage = getErrorMessage(error, t);
  } else if (message) {
    const translationKey = `serverErrors.${message}`;
    const translated = t(translationKey);
    displayMessage = translated !== translationKey ? translated : message;
  }

  if (!displayMessage) {
    displayMessage = t("common.unexpectedError");
  }

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="max-w-md text-center">
        {showIcon && (
          <AlertCircle className="text-danger mx-auto mb-4 h-12 w-12" />
        )}
        <Alert status="danger" className="text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{displayMessage}</Alert.Description>
          </Alert.Content>
        </Alert>
      </div>
    </div>
  );
}

