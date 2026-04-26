import { InfoRow } from "@/core/components/ui/InfoRow";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { CalendarPlus, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PatientAuditInfoProps {
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export function PatientAuditInfo({ createdBy, updatedBy, updatedAt }: PatientAuditInfoProps) {
  const { t } = useTranslation();
  const { formatDateShort, formatTimeOnly } = useDateFormat();

  if (!createdBy && !updatedBy && !updatedAt) return null;

  return (
    <>
      <div className="border-divider border-t" />
      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        {createdBy && (
          <InfoRow
            icon={<UserCheck className="h-3.5 w-3.5" />}
            label={t("patients.registeredBy")}
            className={updatedAt ? "border-divider border-b" : ""}
          >
            {createdBy}
          </InfoRow>
        )}
        {updatedBy ? (
          <InfoRow
            icon={<UserCheck className="h-3.5 w-3.5" />}
            label={t("patients.lastUpdatedBy")}
            className={updatedAt ? "border-divider border-b" : ""}
          >
            {updatedBy}
          </InfoRow>
        ) : (
          <div />
        )}
        {updatedAt && (
          <InfoRow
            icon={<CalendarPlus className="h-3.5 w-3.5" />}
            label={t("patients.lastUpdated")}
          >
            <span className="flex gap-3">
              <span>{formatDateShort(updatedAt)}</span>
              <span className="text-accent text-xs">{formatTimeOnly(updatedAt)}</span>
            </span>
          </InfoRow>
        )}
      </div>
    </>
  );
}
