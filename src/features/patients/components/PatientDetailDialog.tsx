import { Dialog } from "@/core/components/ui/Dialog";
import { InfoRow } from "@/core/components/ui/InfoRow";
import { Loading } from "@/core/components/ui/Loading";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { canDeletePatient, canEditPatient, canViewAuditTrail } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Button } from "@heroui/react";
import { Cake, CalendarClock, CalendarPlus, Edit, MapPin, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { calculateDetailedAge, formatDetailedAge } from "../../../core/utils/ageUtils";
import { usePatientDetail } from "../patientsHooks";
import { PatientAuditInfo } from "./PatientAuditInfo";
import { PatientContactInfo } from "./PatientContactInfo";
import { PatientIdentityHeader } from "./PatientIdentityHeader";

interface PatientDetailDialogProps {
  patientId: string | null;
  onClose: () => void;
  onEdit?: (patientId: string) => void;
  onDelete?: (patientId: string, patientName: string) => void;
  isSuperAdmin?: boolean;
}

export function PatientDetailDialog({
  patientId,
  onClose,
  onEdit,
  onDelete,
  isSuperAdmin = false,
}: PatientDetailDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { formatDateShort } = useDateFormat();
  const { data, isLoading } = usePatientDetail(patientId, isSuperAdmin);
  const { user } = useMe();

  const isAr = i18n.language === "ar";
  const locationParts = [
    isAr ? data?.cityNameAr : data?.cityNameEn,
    isAr ? data?.stateNameAr : data?.stateNameEn,
    isAr ? data?.countryNameAr : data?.countryNameEn,
  ].filter(Boolean);

  const showEdit = canEditPatient(user) && !!onEdit;
  const showDelete = canDeletePatient(user) && !!onDelete;
  const showAudit = canViewAuditTrail(user);

  const footer =
    data && (showEdit || showDelete) ? (
      <div className="flex w-full gap-2">
        {showDelete && (
          <Button
            variant="outline"
            size="sm"
            onPress={() => onDelete!(data.id, data.fullName)}
            className="text-danger border-danger/30 hover:bg-danger/10 flex-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("common.delete")}
          </Button>
        )}
        {showEdit && (
          <Button variant="primary" size="sm" onPress={() => onEdit!(data.id)} className="flex-1">
            <Edit className="h-3.5 w-3.5" />
            {t("common.edit")}
          </Button>
        )}
      </div>
    ) : undefined;

  return (
    <Dialog isOpen={!!patientId} onClose={onClose} size="xl" footer={footer}>
      {isLoading ? (
        <Loading className="h-48" />
      ) : data ? (
        <div className="flex flex-col gap-5">
          {/* 1. Identity header */}
          <PatientIdentityHeader
            fullName={data.fullName}
            patientCode={data.patientCode}
            gender={data.gender}
            bloodType={data.bloodType}
            dateOfBirth={data.dateOfBirth}
            clinicName={data.clinicName}
            isSuperAdmin={isSuperAdmin}
          />

          <div className="border-divider border-t" />

          {/* 2. Core info */}
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            <InfoRow
              icon={<Cake className="h-3.5 w-3.5" />}
              label={t("patients.dateOfBirth")}
              className="border-divider border-b"
            >
              <span dir="ltr">{formatDateShort(data.dateOfBirth)}</span>
            </InfoRow>

            {locationParts.length > 0 && (
              <InfoRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                label={t("common.fields.address")}
                className="border-divider border-b"
              >
                {locationParts.join(" · ")}
              </InfoRow>
            )}

            <InfoRow
              icon={<CalendarPlus className="h-3.5 w-3.5" />}
              label={t("patients.age")}
              className="border-divider border-b"
            >
              {formatDetailedAge(calculateDetailedAge(data.dateOfBirth), isRTL)}
            </InfoRow>
          </div>

          {/* 3. Phones + Chronic diseases */}
          <PatientContactInfo
            phoneNumbers={data.phoneNumbers}
            chronicDiseases={data.chronicDiseases}
          />

          {/* 4. Last visit (placeholder — TODO: wire up real API) */}
          <LastVisitPlaceholder />

          {/* 5. Audit info */}
          {showAudit && (
            <PatientAuditInfo
              createdBy={data.createdBy}
              updatedBy={data.updatedBy}
              updatedAt={data.updatedAt}
            />
          )}
        </div>
      ) : null}
    </Dialog>
  );
}

/** Placeholder until GET /patients/{id}/visits is implemented */
function LastVisitPlaceholder() {
  const { t } = useTranslation();
  return (
    <div className="bg-surface-secondary/50 rounded-xl p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <CalendarClock className="text-accent h-3.5 w-3.5" />
        <p className="text-foreground text-sm font-semibold">{t("patients.lastVisit")}</p>
      </div>
      <div className="grid grid-cols-1 gap-x-8 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-0.5 py-1">
          <span className="text-muted text-xs">{t("patients.visitDate")}</span>
          <span className="text-foreground font-medium">
            15/03/2026 · <span className="text-accent text-xs">10:30 am</span>
          </span>
        </div>
        <div className="flex flex-col gap-0.5 py-1">
          <span className="text-muted text-xs">{t("patients.visitDoctor")}</span>
          <span className="text-foreground font-medium">Dr. Ahmed Hassan</span>
        </div>
      </div>
      <div className="border-divider mt-2 border-t pt-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <CalendarClock className="text-warning h-3.5 w-3.5" />
            <span className="text-foreground font-semibold">{t("patients.nextVisit")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-foreground font-medium" dir="ltr">02/10/2024</span>
            <span className="text-warning">09:00 am</span>
            <span className="text-muted">·</span>
            <span className="text-muted">Dr. Ahmed Hassan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
