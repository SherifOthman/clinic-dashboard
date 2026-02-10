import {
  extractErrorCode,
  translateServerError,
} from "@/core/utils/errorTranslation";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorMessageProps {
  message?: string;
  error?: any;
  className?: string;
  showIcon?: boolean;
}

/**
 * Reusable error message component
 * Provides consistent error display across the application
 */
export function ErrorMessage({
  message,
  error,
  className = "",
  showIcon = true,
}: ErrorMessageProps) {
  const { t } = useTranslation();

  let displayMessage = message;

  // If we have an error object, try to extract and translate the error code
  if (error) {
    const errorCode = extractErrorCode(error);
    displayMessage = translateServerError(t, errorCode);
  } else if (message) {
    // Try to translate the message as an error code
    displayMessage = translateServerError(t, message);
  }

  if (!displayMessage) {
    displayMessage = t("common.unexpectedError");
  }

  return (
    <div
      className={`flex items-center justify-center min-h-[200px] ${className}`}
    >
      <div className="text-center space-y-2">
        {showIcon && <AlertCircle className="w-12 h-12 text-danger mx-auto" />}
        <p className="text-danger font-medium">{displayMessage}</p>
      </div>
    </div>
  );
}
