import type { TableAction } from "@/core/components/ui/EntityTable";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PatientDto } from "../types/patient";

interface UsePatientTableActionsProps {
  onEdit?: (patient: PatientDto) => void;
  onDelete?: (patient: PatientDto) => void;
}

export function usePatientTableActions({
  onEdit,
  onDelete,
}: UsePatientTableActionsProps): TableAction<PatientDto>[] {
  const { t } = useTranslation();

  return [
    {
      key: "edit",
      label: t("patients.edit"),
      icon: <Edit className="w-4 h-4" />,
      color: "primary",
      onAction: (patient) => onEdit?.(patient),
    },
    {
      key: "delete",
      label: t("patients.delete"),
      icon: <Trash2 className="w-4 h-4" />,
      color: "danger",
      onAction: (patient) => onDelete?.(patient),
    },
  ];
}
