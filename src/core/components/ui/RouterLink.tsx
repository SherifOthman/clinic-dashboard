import { cn } from "@/core/utils/cn";
import { Link, LinkProps } from "react-router-dom";

interface RouterLinkProps extends LinkProps {
  className?: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
}

/**
 * Reusable router link component
 * Provides consistent styling for navigation links
 */
export function RouterLink({
  className,
  children,
  color = "primary",
  size = "md",
  onPress,
  ...props
}: RouterLinkProps) {
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "text-primary hover:text-primary/80";
      case "secondary":
        return "text-secondary hover:text-secondary/80";
      case "success":
        return "text-success hover:text-success/80";
      case "warning":
        return "text-warning hover:text-warning/80";
      case "danger":
        return "text-danger hover:text-danger/80";
      default:
        return "text-foreground hover:text-foreground/80";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  return (
    <Link
      className={cn(
        "transition-colors",
        getColorClasses(),
        getSizeClasses(),
        className,
      )}
      onClick={onPress}
      {...props}
    >
      {children}
    </Link>
  );
}
