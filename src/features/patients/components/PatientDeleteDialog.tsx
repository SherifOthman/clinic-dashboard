import { ConfirmDialog } from "@/core/components/ui/ConfirmDialog";
import { useTranslation } from "react-i18next";
import type { PatientDto } from "../types/patient";

interface PatientDeleteDialogProps {
  patient: PatientDto | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PatientDeleteDialog({
  patient,
  isLoading,
  onConfirm,
  onCancel,
}: PatientDeleteDialogProps) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      isOpen={!!patient}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={t("patients.deletePatient")}
      message={
        patient
          ? t("patients.deleteConfirmation", {
              name: patient.fullName,
            })
          : ""
      }
      confirmText={t("patients.delete")}
      cancelText={t("patients.cancel")}
      variant="danger"
      isLoading={isLoading}
    />
  );
}
