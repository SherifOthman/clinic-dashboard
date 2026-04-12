import { Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";
import {
  FallbackProps,
  ErrorBoundary as ReactErrorBoundary,
} from "react-error-boundary";
import { useTranslation } from "react-i18next";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex max-w-md flex-col gap-4 p-8 text-center">
        <AlertTriangle className="text-danger mx-auto h-16 w-16" />
        <h1 className="text-3xl font-bold">{t("errors.somethingWentWrong")}</h1>
        <p className="text-default-600">{t("errors.unexpectedErrorMessage")}</p>
        <div className="flex justify-center gap-4">
          <Button onPress={resetErrorBoundary} variant="primary">
            {t("common.tryAgain")}
          </Button>
          <Button onPress={() => window.location.reload()} variant="outline">
            {t("errors.refreshPage")}
          </Button>
        </div>
        {import.meta.env.DEV && (
          <details className="mt-4 text-left">
            <summary className="text-default-600 cursor-pointer text-sm">
              Error Details (Development)
            </summary>
            <pre className="bg-danger-50 text-danger mt-2 overflow-auto rounded p-2 text-xs">
              {error instanceof Error ? error.message : String(error)}
              {error instanceof Error && error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error("Uncaught React error", {
          error: errorMessage,
          stack: errorStack,
          errorInfo,
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

