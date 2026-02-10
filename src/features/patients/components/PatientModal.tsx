import { BaseModal } from "@/core/components/ui/BaseModal";
import { useTranslation } from "react-i18next";
import type {
  CreatePatientFormData,
  UpdatePatientFormData,
} from "../schemas/patientSchemas";
import type { PatientDto } from "../types/patient";
import { PatientDetails } from "./PatientDetails";
import { PatientForm } from "./PatientForm";

type ViewMode = "create" | "edit" | "details";

interface PatientModalProps {
  isOpen: boolean;
  viewMode: ViewMode;
  patient?: PatientDto;
  onClose: () => void;
  onCreateSubmit: (data: CreatePatientFormData) => Promise<void>;
  onUpdateSubmit: (data: UpdatePatientFormData) => Promise<void>;
  onEdit: () => void;
  createLoading?: boolean;
  updateLoading?: boolean;
  createError?: any;
  updateError?: any;
}

export function PatientModal({
  isOpen,
  viewMode,
  patient,
  onClose,
  onCreateSubmit,
  onUpdateSubmit,
  onEdit,
  createLoading = false,
  updateLoading = false,
  createError,
  updateError,
}: PatientModalProps) {
  const { t } = useTranslation();

  const getModalTitle = () => {
    switch (viewMode) {
      case "create":
        return t("patients.addPatient");
      case "edit":
        return t("patients.editPatient");
      case "details":
        return t("patients.patientDetails");
      default:
        return "";
    }
  };

  const getModalSize = () => {
    return viewMode === "details" ? "5xl" : "3xl";
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size={getModalSize()}
    >
      {viewMode === "create" && (
        <PatientForm
          onSubmit={onCreateSubmit}
          onCancel={onClose}
          isLoading={createLoading}
          error={createError}
        />
      )}

      {viewMode === "edit" && patient && (
        <PatientForm
          patient={patient}
          onSubmit={onUpdateSubmit}
          onCancel={onClose}
          isLoading={updateLoading}
          error={updateError}
        />
      )}

      {viewMode === "details" && patient && (
        <PatientDetails patient={patient} onEdit={onEdit} />
      )}
    </BaseModal>
  );
}
