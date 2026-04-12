import type { ReactNode } from "react";

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  /** Value content — accepts any ReactNode */
  children: ReactNode;
  /** Optional text direction for the value (e.g. "ltr" for phone numbers) */
  dir?: "ltr" | "rtl";
  className?: string;
}

/**
 * Shared label+value row used in detail dialogs.
 *
 * Layout: [icon badge] [label (muted xs) / value (sm medium)]
 */
export function InfoRow({
  icon,
  label,
  children,
  dir,
  className,
}: InfoRowProps) {
  return (
    <div className={`flex items-start gap-3 py-2.5 ${className ?? ""}`}>
      <div className="bg-surface-secondary mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        <span className="text-muted">{icon}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-muted text-xs">{label}</span>
        <span
          className="text-foreground truncate text-sm font-medium"
          dir={dir}
        >
          {children}
        </span>
      </div>
    </div>
  );
}
