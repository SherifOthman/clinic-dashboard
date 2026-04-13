import type { Column } from "@/core/components/ui/DataTable";
import { getPatientImageSrc } from "@/core/utils/patientImageUtils";
import { formatPhoneNational } from "@/core/utils/phoneFormat";
import { Avatar, Chip } from "@heroui/react";
import type { TFunction } from "i18next";
import { AlertCircle } from "lucide-react";
import {
  calculateDetailedAge,
  formatDetailedAge,
} from "../../../core/utils/ageUtils";
import type { PatientListItem } from "../types";
import { BLOOD_TYPE_COLORS } from "../types";

interface PatientColumnsOptions {
  t: TFunction;
  formatDate: (date: string) => string;
  isAr?: boolean;
  showClinic?: boolean;
}

export function getPatientColumns({
  t,
  formatDate,
  isAr = false,
  showClinic = false,
}: PatientColumnsOptions): Column<PatientListItem>[] {
  const columns: Column<PatientListItem>[] = [
    // 1. Name + code
    {
      key: "fullName",
      label: t("common.fields.name"),
      sortable: true,
      render: (patient) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="sm"
            className={`shrink-0 ring-1 ${patient.gender === "Female" ? "ring-pink-400" : "ring-accent/50"}`}
          >
            <Avatar.Image
              className="object-cover"
              src={getPatientImageSrc(patient.gender, patient.dateOfBirth)}
              alt={patient.fullName}
            />
            <Avatar.Fallback>
              {patient.gender === "Male" ? "♂" : "♀"}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <span className="leading-tight font-medium">
              {patient.fullName}
            </span>
            <span className="text-muted text-xs">{patient.patientCode}</span>
          </div>
        </div>
      ),
    },
    // 2. Age
    {
      key: "age",
      label: t("patients.age"),
      sortable: true,
      render: (patient) => {
        const detailed = calculateDetailedAge(patient.dateOfBirth);
        return (
          <span dir="ltr" className="text-sm font-medium">
            {formatDetailedAge(detailed, isAr)}
          </span>
        );
      },
    },
    // 3. Phone
    {
      key: "primaryPhone",
      label: t("common.fields.phone"),
      render: (patient) =>
        patient.primaryPhone ? (
          <span dir="ltr" className="text-sm">
            {formatPhoneNational(patient.primaryPhone)}
          </span>
        ) : (
          <span className="text-muted text-xs">—</span>
        ),
    },
    // 4. City
    {
      key: "cityGeonameId",
      label: t("location.city"),
      render: (patient) =>
        patient.cityGeonameId ? (
          // TODO: resolve city name from GeoNames — requires per-row hook or a lookup map
          <span className="text-muted font-mono text-xs">
            {patient.cityGeonameId}
          </span>
        ) : (
          <span className="text-muted text-xs">—</span>
        ),
    },
    // 5. Blood type
    {
      key: "bloodType",
      label: t("patients.bloodType"),
      render: (patient) =>
        patient.bloodType ? (
          <Chip
            size="sm"
            variant="soft"
            color={BLOOD_TYPE_COLORS[patient.bloodType] ?? "default"}
          >
            {patient.bloodType}
          </Chip>
        ) : (
          <span className="text-muted text-xs">—</span>
        ),
    },
    // 6. Conditions
    {
      key: "chronicDiseaseCount",
      label: t("patients.conditions"),
      sortable: true,
      render: (patient) =>
        patient.chronicDiseaseCount > 0 ? (
          <Chip size="sm" variant="soft" color="warning">
            <AlertCircle className="h-3 w-3" />
            {patient.chronicDiseaseCount}
          </Chip>
        ) : (
          <span className="text-muted text-xs">—</span>
        ),
    },
    // 7. Debts — placeholder until billing is implemented
    {
      key: "debts",
      label: t("patients.debts"),
      render: () => (
        <span className="text-muted text-xs italic">
          {t("common.comingSoon")}
        </span>
      ),
    },
    // 8. Registered date
    {
      key: "createdAt",
      label: t("patients.registeredAt"),
      sortable: true,
      render: (patient) => (
        <span dir="ltr" className="text-muted text-sm">
          {formatDate(patient.createdAt)}
        </span>
      ),
    },
  ];

  if (showClinic) {
    columns.push({
      key: "clinicName",
      label: t("patients.clinic"),
      render: (patient) =>
        patient.clinicName ? (
          <span className="text-sm">{patient.clinicName}</span>
        ) : (
          <span className="text-muted text-xs">—</span>
        ),
    });
  }

  return columns;
}
