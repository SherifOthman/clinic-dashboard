import { Spinner } from "@heroui/spinner";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

/**
 * Reusable loading component
 * Provides consistent loading UI across the application
 */
export function Loading({
  size = "lg",
  label = "Loading...",
  className,
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${className || ""}`}
    >
      <Spinner size={size} />
      {label && <p className="mt-4 text-sm text-default-600">{label}</p>}
    </div>
  );
}
