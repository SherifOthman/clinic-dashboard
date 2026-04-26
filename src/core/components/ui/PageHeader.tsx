import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional action button or element placed on the right */
  action?: ReactNode;
  /** Extra content below title/subtitle (e.g. a record count) */
  children?: ReactNode;
}

/**
 * Standard page header used across all feature pages.
 * Replaces the repeated title/subtitle div pattern.
 *
 * Usage:
 *   <PageHeader title={t("patients.title")} subtitle={t("patients.subtitle")} action={<Button>...</Button>} />
 */
export function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="mb-1 text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-default-500 text-sm">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
