import { AlertDialog, Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog dir={dir} className="max-w-md min-w-[320px]">
          <AlertDialog.Header>
            {variant === "danger" && (
              <AlertDialog.Icon status="danger">
                <AlertTriangle className="h-5 w-5" />
              </AlertDialog.Icon>
            )}
            <AlertDialog.Heading>{title}</AlertDialog.Heading>
          </AlertDialog.Header>

          <AlertDialog.Body>
            {typeof message === "string" ? (
              <p className="py-2 leading-relaxed">{message}</p>
            ) : (
              message
            )}
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={onClose} isDisabled={isLoading}>
              {cancelText || t("common.cancel")}
            </Button>
            <Button
              variant={variant}
              onPress={handleConfirm}
              isPending={isLoading}
              isDisabled={isLoading}
            >
              {confirmText || t("common.confirm")}
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
