import type { TableColumn } from "@/core/components/ui/EntityTable";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { useGenderDisplay } from "@/core/hooks/useGenderDisplay";
import { getGenderColor } from "@/core/utils/genderUtils";
import { Chip } from "@heroui/chip";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PatientDto } from "../types/patient";

export function usePatientTableColumns(): TableColumn<PatientDto>[] {
  const { t } = useTranslation();
  const { getTranslatedGenderDisplay } = useGenderDisplay();
  const { formatDateShort } = useDateFormat();

  return [
    {
      key: "fullName",
      label: t("patients.name"),
      sortable: true,
      render: (patient) => (
        <div className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600/50 group-hover:scale-105 transition-all duration-300 ease-in-out">
            <User className="w-4 h-4 text-primary group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          </div>
          <div>
            <div className="font-medium text-foreground group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              {patient.fullName}
            </div>
            <div className="text-sm text-default-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
              ID: {patient.id} • {t("patients.clickToView")}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "age",
      label: t("patients.age"),
      sortable: true,
      render: (patient) => (
        <div>
          <div className="font-medium">
            {patient.age} {t("patients.years")}
          </div>
          {patient.dateOfBirth && (
            <div className="text-sm text-default-500 table-date-cell">
              {formatDateShort(patient.dateOfBirth)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "gender",
      label: t("patients.gender"),
      sortable: true,
      render: (patient) => (
        <Chip size="sm" variant="flat" color={getGenderColor(patient.gender)}>
          {getTranslatedGenderDisplay(patient.gender)}
        </Chip>
      ),
    },
    {
      key: "createdAt",
      label: t("patients.created"),
      sortable: true,
      render: (patient) => (
        <div className="text-sm text-default-600 table-date-cell">
          {formatDateShort(patient.createdAt)}
        </div>
      ),
    },
  ];
}
