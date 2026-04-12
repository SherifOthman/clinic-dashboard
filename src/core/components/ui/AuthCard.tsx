import { Card } from "@heroui/react";
import { ReactNode } from "react";

import { cn } from "@/core/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable authentication card wrapper for HeroUI
 * Provides consistent styling for auth pages
 */
export function AuthCard({
  title,
  subtitle,
  children,
  className,
}: AuthCardProps) {
  return (
    <Card className={cn("w-full max-w-sm p-6", className)}>
      <Card.Header className="flex-col gap-1 text-center pb-4">
        <Card.Title>{title}</Card.Title>
        {subtitle && <Card.Description>{subtitle}</Card.Description>}
      </Card.Header>
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}

