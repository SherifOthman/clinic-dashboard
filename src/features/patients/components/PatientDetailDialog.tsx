import { Dialog } from "@/core/components/ui/Dialog";
import { InfoRow } from "@/core/components/ui/InfoRow";
import { Loading } from "@/core/components/ui/Loading";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { getPatientImageSrc } from "@/core/utils/patientImageUtils";
import {
  canDeletePatient,
  canEditPatient,
  canViewAuditTrail,
} from "@/core/utils/permissions";
import { formatPhoneInternational } from "@/core/utils/phoneFormat";
import { useMe } from "@/features/auth/hooks";
import { Avatar, Button, Chip } from "@heroui/react";
import {
  Cake,
  CalendarClock,
  CalendarPlus,
  Edit,
  MapPin,
  Phone,
  Stethoscope,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  calculateDetailedAge,
  formatDetailedAge,
} from "../../../core/utils/ageUtils";
import { usePatientDetail } from "../patientsHooks";
import { BLOOD_TYPE_COLORS } from "../types";
import { GenderChip } from "./GenderChip";

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
  const { formatDateShort, formatTimeOnly } = useDateFormat();
  const { data, isLoading } = usePatientDetail(patientId, isSuperAdmin);
  const { user } = useMe();

  // Names come directly from the backend — pick language here, no extra API calls
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
          <Button
            variant="primary"
            size="sm"
            onPress={() => onEdit!(data.id)}
            className="flex-1"
          >
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
          {/* ── 1. Identity header ── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Avatar + info — always a horizontal row */}
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <Avatar className="h-14 w-14 shrink-0">
                <Avatar.Image
                  className="object-cover"
                  src={getPatientImageSrc(data.gender, data.dateOfBirth)}
                  alt={data.fullName}
                />
                <Avatar.Fallback className="text-base font-bold">
                  {data.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </Avatar.Fallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <h2 className="text-foreground truncate text-lg font-bold">
                  {data.fullName}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5">
                  <code className="bg-surface-secondary text-muted rounded px-1.5 py-0.5 text-xs tracking-widest">
                    {data.patientCode}
                  </code>
                  <GenderChip gender={data.gender} size="sm" />
                  {data.bloodType && (
                    <Chip
                      size="sm"
                      variant="soft"
                      color={BLOOD_TYPE_COLORS[data.bloodType] ?? "default"}
                    >
                      {data.bloodType}
                    </Chip>
                  )}
                  {isSuperAdmin && data.clinicName && (
                    <Chip size="sm" variant="soft" color="default">
                      {data.clinicName}
                    </Chip>
                  )}
                </div>
              </div>
            </div>

            {/* TODO: wire up Medical History page/dialog */}
            {/* mobile: full-width below avatar+info | sm+: inline to the right */}
            <Button
              variant="outline"
              size="sm"
              className="text-accent border-accent/30 hover:bg-accent w-full shrink-0 hover:text-white sm:w-auto"
              onPress={() =>
                alert(
                  "Comming soon: view patient's medical history (visits, diagnoses, etc.)",
                )
              }
            >
              {t("patients.medicalHistory")}
            </Button>
          </div>

          <div className="border-divider border-t" />

          {/* ── 2. Core info — 2-col left-to-right ── */}
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {/* col 1 */}
            <InfoRow
              icon={<Cake className="h-3.5 w-3.5" />}
              label={t("patients.dateOfBirth")}
              className="border-divider border-b"
            >
              <span dir="ltr">{formatDateShort(data.dateOfBirth)}</span>
            </InfoRow>

            {/* col 2 */}
            {locationParts.length > 0 && (
              <InfoRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                label={t("common.fields.address")}
                className="border-divider border-b"
              >
                {locationParts.join(" · ")}
              </InfoRow>
            )}

            {/* col 1 */}
            <InfoRow
              icon={<CalendarPlus className="h-3.5 w-3.5" />}
              label={t("patients.age")}
              className="border-divider border-b"
            >
              {formatDetailedAge(calculateDetailedAge(data.dateOfBirth), isRTL)}
            </InfoRow>
          </div>

          {/* ── 3. Phones + Chronic diseases ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Phones */}
            {data.phoneNumbers.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Phone className="text-accent h-3.5 w-3.5" />
                  <p className="text-foreground text-sm font-semibold">
                    {t("patients.phoneNumbers")}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  {data.phoneNumbers.map((phone: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <Phone className="text-muted h-3.5 w-3.5 shrink-0" />
                      <span
                        className="text-foreground font-mono text-sm tracking-wide"
                        dir="ltr"
                      >
                        {formatPhoneInternational(phone)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chronic diseases */}
            {data.chronicDiseases.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="text-warning h-3.5 w-3.5" />
                  <p className="text-foreground text-sm font-semibold">
                    {t("patients.chronicDiseases")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.chronicDiseases.map(
                    (d: { id: string; nameEn: string; nameAr: string }) => (
                      <Chip key={d.id} size="sm" variant="soft" color="warning">
                        {isRTL ? d.nameAr : d.nameEn}
                      </Chip>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* TODO: fetch from GET /patients/{id}/visits?pageSize=2&sortDirection=desc — last visit + next appointment */}
          <div className="bg-surface-secondary/50 rounded-xl p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <CalendarClock className="text-accent h-3.5 w-3.5" />
              <p className="text-foreground text-sm font-semibold">
                {t("patients.lastVisit")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-8 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-0.5 py-1">
                <span className="text-muted text-xs">
                  {t("patients.visitDate")}
                </span>
                <span className="text-foreground font-medium">
                  15/03/2026 ·{" "}
                  <span className="text-accent text-xs">10:30 am</span>
                </span>
              </div>
              <div className="flex flex-col gap-0.5 py-1">
                <span className="text-muted text-xs">
                  {t("patients.visitDoctor")}
                </span>
                <span className="text-foreground font-medium">
                  Dr. Ahmed Hassan
                </span>
              </div>
            </div>

            <div className="border-divider mt-2 border-t pt-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="text-warning h-3.5 w-3.5" />
                  <span className="text-foreground font-semibold">
                    {t("patients.nextVisit")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-foreground font-medium" dir="ltr">
                    02/10/2024
                  </span>
                  <span className="text-warning">09:00 am</span>
                  <span className="text-muted">·</span>
                  <span className="text-muted">Dr. Ahmed Hassan</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 5. Audit info — ClinicOwner / SuperAdmin only ── */}
          {showAudit && (
            <>
              <div className="border-divider border-t" />
              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {/* Row 1: Registered By | Last Updated By */}
                {data.createdBy && (
                  <InfoRow
                    icon={<UserCheck className="h-3.5 w-3.5" />}
                    label={t("patients.registeredBy")}
                    className={data.updatedAt ? "border-divider border-b" : ""}
                  >
                    {data.createdBy}
                  </InfoRow>
                )}
                {data.updatedBy ? (
                  <InfoRow
                    icon={<UserCheck className="h-3.5 w-3.5" />}
                    label={t("patients.lastUpdatedBy")}
                    className={data.updatedAt ? "border-divider border-b" : ""}
                  >
                    {data.updatedBy}
                  </InfoRow>
                ) : (
                  <div />
                )}

                {/* Row 2: Last Updated | (empty) */}
                {data.updatedAt && (
                  <InfoRow
                    icon={<CalendarPlus className="h-3.5 w-3.5" />}
                    label={t("patients.lastUpdated")}
                  >
                    <span className="flex gap-3">
                      <span>{formatDateShort(data.updatedAt)}</span>
                      <span className="text-accent text-xs">
                        {formatTimeOnly(data.updatedAt)}
                      </span>
                    </span>
                  </InfoRow>
                )}
              </div>
            </>
          )}
        </div>
      ) : null}
    </Dialog>
  );
}
