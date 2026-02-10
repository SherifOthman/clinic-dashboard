import { Chip } from "@heroui/chip";

interface StatusChipProps {
  status: string;
  colorMap?: Record<string, string>;
  variant?:
    | "flat"
    | "solid"
    | "bordered"
    | "light"
    | "faded"
    | "shadow"
    | "dot";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Status chip component for displaying status indicators
 */
export function StatusChip({
  status,
  colorMap,
  variant = "flat",
  size = "sm",
  className,
}: StatusChipProps) {
  const getStatusColor = (status: string) => {
    // Use custom color map if provided
    if (colorMap && colorMap[status]) {
      return colorMap[status] as any;
    }

    const normalizedStatus = status.toLowerCase();

    if (
      normalizedStatus.includes("active") ||
      normalizedStatus.includes("confirmed") ||
      normalizedStatus.includes("verified")
    ) {
      return "success";
    }
    if (
      normalizedStatus.includes("pending") ||
      normalizedStatus.includes("waiting")
    ) {
      return "warning";
    }
    if (
      normalizedStatus.includes("inactive") ||
      normalizedStatus.includes("disabled") ||
      normalizedStatus.includes("cancelled")
    ) {
      return "danger";
    }
    if (
      normalizedStatus.includes("draft") ||
      normalizedStatus.includes("unconfirmed")
    ) {
      return "default";
    }

    return "primary";
  };

  return (
    <Chip
      color={getStatusColor(status)}
      variant={variant}
      size={size}
      className={className}
    >
      {status}
    </Chip>
  );
}
