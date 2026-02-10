import { logger } from "@/core/services/logger";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";
import {
  FallbackProps,
  ErrorBoundary as ReactErrorBoundary,
} from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <AlertTriangle className="w-16 h-16 text-danger mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="text-default-600 max-w-md">
          An unexpected error occurred. Please refresh the page or contact
          support if the problem persists.
        </p>
        <div className="space-x-4">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-default-200 text-default-700 rounded-lg hover:bg-default-300 transition-colors"
          >
            Refresh Page
          </button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-default-500">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-danger bg-danger-50 p-2 rounded overflow-auto">
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
        logger.error(
          "Uncaught React error",
          { error: errorMessage, stack: errorStack, errorInfo },
          "ErrorBoundary",
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
