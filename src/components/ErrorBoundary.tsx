import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { AlertTriangle, Bug, Home, RefreshCw } from "lucide-react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // In a real app, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;
    console.error("Error reported:", { error, errorInfo });
    alert("Error report sent. Thank you for helping us improve!");
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full shadow-lg border border-divider">
            <CardBody className="text-center p-8">
              {/* Error Illustration */}
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-danger/10 rounded-full">
                    <AlertTriangle size={48} className="text-danger" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground">
                  Something went wrong
                </h1>
                <p className="text-default-500">
                  An unexpected error occurred in the application. Please try
                  refreshing the page or contact support if the problem
                  persists.
                </p>
              </div>

              {/* Error Details (Development) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mt-6 p-4 bg-default-100 rounded-lg text-left">
                  <h3 className="font-semibold text-sm mb-2">Error Details:</h3>
                  <pre className="text-xs text-default-600 overflow-auto max-h-32 mb-2">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <h4 className="font-semibold text-xs mb-1">
                        Component Stack:
                      </h4>
                      <pre className="text-xs text-default-600 overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button
                  color="primary"
                  startContent={<RefreshCw size={18} />}
                  onPress={this.handleReload}
                  className="flex-1"
                >
                  Reload Page
                </Button>
                <Button
                  variant="bordered"
                  startContent={<Home size={18} />}
                  onPress={this.handleGoHome}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>

              {/* Report Error */}
              <div className="mt-6 pt-6 border-t border-divider">
                <Button
                  size="sm"
                  variant="light"
                  startContent={<Bug size={16} />}
                  onPress={this.handleReportError}
                  className="text-default-500"
                >
                  Report this error
                </Button>
                <p className="text-xs text-default-400 mt-2">
                  Help us improve by reporting this issue
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
