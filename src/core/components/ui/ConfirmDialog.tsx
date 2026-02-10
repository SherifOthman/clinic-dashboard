import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

/**
 * Confirmation dialog component
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor,
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  const getVariantColor = () => {
    if (confirmColor) return confirmColor as any;

    switch (variant) {
      case "danger":
        return "danger";
      case "warning":
        return "warning";
      case "primary":
      default:
        return "primary";
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case "danger":
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          {getVariantIcon()}
          <span>{title || t("common.confirm")}</span>
        </ModalHeader>
        <ModalBody>
          <p className="text-default-600">
            {message || t("common.confirmAction")}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            {cancelText || t("common.cancel")}
          </Button>
          <Button
            color={getVariantColor()}
            onPress={onConfirm}
            isLoading={isLoading}
          >
            {confirmText || t("common.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
