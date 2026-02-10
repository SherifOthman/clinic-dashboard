import { CardBody, CardHeader, Card as HeroCard } from "@heroui/card";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * Reusable Card component
 * Wrapper around HeroUI Card with consistent styling
 */
export function Card({
  children,
  className = "",
  header,
  title,
  subtitle,
}: CardProps) {
  return (
    <HeroCard className={`shadow-sm ${className}`}>
      {(header || title || subtitle) && (
        <CardHeader className="pb-3">
          {header || (
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-default-600">{subtitle}</p>
              )}
            </div>
          )}
        </CardHeader>
      )}
      <CardBody className="pt-0">{children}</CardBody>
    </HeroCard>
  );
}
