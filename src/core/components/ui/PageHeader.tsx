import { Text } from "@heroui/react";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string | ReactNode;
  /** Optional action button or element placed on the right */
  action?: ReactNode;
  /** Extra content below title/subtitle (e.g. a record count) */
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <Text type="h1" weight="bold" className="mb-1 text-2xl sm:text-3xl">{title}</Text>
        {subtitle && (
          typeof subtitle === "string"
            ? <Text type="body-sm" color="muted">{subtitle}</Text>
            : <div className="text-sm text-muted">{subtitle}</div>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
