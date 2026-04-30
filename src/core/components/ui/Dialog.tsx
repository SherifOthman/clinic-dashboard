import { Modal } from "@heroui/react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  header?: ReactNode;
  title?: string;
  icon?: ReactNode;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Explicit aria-label — use when header is a custom ReactNode with no title prop */
  ariaLabel?: string;
}

/**
 * Base dialog wrapper built on HeroUI Modal.
 *
 * Header rendering priority:
 *   1. `header` prop — fully custom, you control everything
 *   2. `title` / `icon` / `description` — rendered with the default layout
 *   3. Nothing — no header rendered
 */
export function Dialog({
  isOpen,
  onClose,
  header,
  title,
  icon,
  description,
  children,
  footer,
  size = "md",
  className,
  ariaLabel,
}: DialogProps) {
  const { i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  const hasHeader = header || title || icon;
  // aria-label priority: explicit ariaLabel > title > fallback "dialog"
  const computedAriaLabel = ariaLabel ?? title ?? "dialog";

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      variant="blur"
    >
      <Modal.Container
        size={size === "xl" ? "lg" : size}
        placement="auto"
        scroll="inside"
      >
        <Modal.Dialog
          dir={dir}
          aria-label={computedAriaLabel}
          className={
            size === "xl" ? `sm:max-w-3xl ${className ?? ""}` : className
          }
        >
          <Modal.CloseTrigger />

          {hasHeader && (
            <Modal.Header>
              {header ?? (
                <DefaultDialogHeader
                  icon={icon}
                  title={title}
                  description={description}
                />
              )}
            </Modal.Header>
          )}

          <Modal.Body className="px-6 py-4">{children}</Modal.Body>

          {footer && <Modal.Footer>{footer}</Modal.Footer>}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

// ── Default header layout ─────────────────────────────────────────────────────

interface DefaultDialogHeaderProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
}

export function DefaultDialogHeader({
  icon,
  title,
  description,
}: DefaultDialogHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <div className="bg-accent-soft text-accent-soft-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {title && (
          <span className="text-muted text-sm font-medium">{title}</span>
        )}
        {description && (
          <h2 className="text-foreground truncate text-lg font-bold">
            {description}
          </h2>
        )}
      </div>
    </div>
  );
}
