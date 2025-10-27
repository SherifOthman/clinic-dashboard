import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface Props {
  children: React.ReactNode;
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const isDevelopment = import.meta.env.MODE === "development";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-lg border border-divider">
        <CardBody className="text-center p-8">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-danger/10 rounded-full">
                <AlertTriangle size={48} className="text-danger" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-default-500">
              An unexpected error occurred. Please try refreshing the page or
              contact support.
            </p>
          </div>

          {isDevelopment && (
            <pre className="mt-6 p-4 bg-default-100 rounded-lg text-left text-xs text-default-600 overflow-auto max-h-32">
              {error.toString()}
            </pre>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              color="primary"
              startContent={<RefreshCw size={18} />}
              onPress={resetErrorBoundary}
              className="flex-1"
            >
              Reload Page
            </Button>
            <Button
              variant="bordered"
              startContent={<Home size={18} />}
              onPress={() => (window.location.href = "/")}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
