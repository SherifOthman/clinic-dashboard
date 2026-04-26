import { formatPatientCode } from "@/core/utils/patientUtils";
import { getPatientImageSrc } from "@/core/utils/patientImageUtils";
import { Avatar, Button, Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { BLOOD_TYPE_COLORS } from "../types";
import { GenderChip } from "./GenderChip";

interface PatientIdentityHeaderProps {
  fullName: string;
  patientCode: string;
  gender: string;
  bloodType?: string | null;
  dateOfBirth?: string;
  clinicName?: string;
  isSuperAdmin?: boolean;
}

export function PatientIdentityHeader({
  fullName,
  patientCode,
  gender,
  bloodType,
  dateOfBirth,
  clinicName,
  isSuperAdmin,
}: PatientIdentityHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar className="h-14 w-14 shrink-0">
          <Avatar.Image
            className="object-cover"
            src={getPatientImageSrc(gender, dateOfBirth)}
            alt={fullName}
          />
          <Avatar.Fallback className="text-base font-bold">
            {fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </Avatar.Fallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h2 className="text-foreground truncate text-lg font-bold">{fullName}</h2>
          <div className="flex flex-wrap items-center gap-1.5">
            <code className="bg-surface-secondary text-muted rounded px-1.5 py-0.5 text-xs tracking-widest">
              {formatPatientCode(patientCode)}
            </code>
            <GenderChip gender={gender} size="sm" />
            {bloodType && (
              <Chip size="sm" variant="soft" color={BLOOD_TYPE_COLORS[bloodType] ?? "default"}>
                {bloodType}
              </Chip>
            )}
            {isSuperAdmin && clinicName && (
              <Chip size="sm" variant="soft" color="default">{clinicName}</Chip>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="text-accent border-accent/30 hover:bg-accent w-full shrink-0 hover:text-white sm:w-auto"
        onPress={() => alert("Coming soon: view patient's medical history")}
      >
        {t("patients.medicalHistory")}
      </Button>
    </div>
  );
}
