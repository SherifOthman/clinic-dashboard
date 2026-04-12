import { Dialog } from "@/core/components/ui/Dialog";
import { InfoRow } from "@/core/components/ui/InfoRow";
import { Loading } from "@/core/components/ui/Loading";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { getFileUrl } from "@/core/utils/fileUtils";
import { getLocalizedValue } from "@/core/utils/i18nUtils";
import { getGenderImageSrc } from "@/core/utils/patientImageUtils";
import { Avatar, Chip } from "@heroui/react";
import { Briefcase, Calendar, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBranches } from "../../branches/branchesHooks";
import { useStaffDetail } from "../staffHooks";
import { WorkingDaysDisplay } from "./WorkingDaysDisplay";

const ROLE_COLORS: Record<string, "accent" | "success" | "default"> = {
  Doctor: "accent",
  ClinicOwner: "success",
  Receptionist: "default",
};

interface StaffDetailDialogProps {
  staffId: string | null;
  onClose: () => void;
}

export function StaffDetailDialog({
  staffId,
  onClose,
}: StaffDetailDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { formatDateShort } = useDateFormat();
  const { data, isLoading } = useStaffDetail(staffId);
  const { data: branches = [] } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const isDoctor = !!data?.doctorProfile;
  // Default to first branch when data loads
  const activeBranchId = selectedBranchId ?? branches[0]?.id ?? null;

  return (
    <Dialog
      isOpen={!!staffId}
      onClose={onClose}
      size={isDoctor && branches.length > 0 ? "lg" : "md"}
    >
      {isLoading ? (
        <Loading className="h-48" />
      ) : data ? (
        <div className="flex flex-col gap-5">
          {/* ── Profile header ── */}
          <div className="flex flex-col items-center gap-3 pt-1 text-center">
            <Avatar className="ring-accent/30 h-20 w-20 rounded-2xl ring-2">
              <Avatar.Image
                className="object-cover"
                src={
                  data.profileImageUrl
                    ? getFileUrl(data.profileImageUrl)
                    : getGenderImageSrc(data.gender)
                }
                alt={data.fullName}
              />
              <Avatar.Fallback className="rounded-2xl text-xl font-bold">
                {data.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-foreground text-xl font-bold">
                  {data.fullName}
                </h2>
                <span className="text-muted text-sm">
                  {data.gender === "Male"
                    ? t("common.fields.male")
                    : t("common.fields.female")}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {data.roles.map((r) => (
                  <Chip
                    key={r.name}
                    size="sm"
                    variant="soft"
                    color={ROLE_COLORS[r.name] ?? "default"}
                  >
                    {t(`staff.roles.${r.name}`, { defaultValue: r.name })}
                  </Chip>
                ))}
                <Chip
                  size="sm"
                  variant="soft"
                  color={data.isActive ? "success" : "danger"}
                >
                  {data.isActive
                    ? t("common.status.active")
                    : t("common.status.inactive")}
                </Chip>
              </div>
            </div>
          </div>

          <div className="border-divider border-t" />

          {/* ── Body: contact left, working days right (doctors only) ── */}
          <div
            className={`grid grid-cols-1 gap-6 ${isDoctor && branches.length > 0 ? "sm:grid-cols-2 sm:gap-8" : ""}`}
          >
            {/* Contact info */}
            <div className="divide-divider divide-y">
              {data.email && (
                <InfoRow
                  icon={<Mail className="h-4 w-4" />}
                  label={t("common.fields.email")}
                >
                  {data.email}
                </InfoRow>
              )}
              {data.phoneNumber && (
                <InfoRow
                  icon={<Phone className="h-4 w-4" />}
                  label={t("common.fields.phoneNumber")}
                  dir="ltr"
                >
                  {data.phoneNumber}
                </InfoRow>
              )}
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label={t("staff.joinDate")}
              >
                <span dir="ltr">{formatDateShort(data.joinDate)}</span>
              </InfoRow>
              {data.doctorProfile && (
                <InfoRow
                  icon={<Briefcase className="text-warning h-4 w-4" />}
                  label={t("common.fields.specialization")}
                >
                  {getLocalizedValue(
                    isRTL,
                    data.doctorProfile.specializationNameAr,
                    data.doctorProfile.specializationNameEn,
                  )}
                </InfoRow>
              )}
            </div>

            {/* Working days per branch */}
            {isDoctor && staffId && branches.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-foreground text-sm font-semibold">
                  {t("staff.workingDays")}
                </p>

                {/* Branch tabs */}
                {branches.length > 1 && (
                  <div className="flex flex-wrap gap-1.5">
                    {branches.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBranchId(b.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          activeBranchId === b.id
                            ? "bg-accent text-white"
                            : "bg-default text-muted hover:text-foreground"
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                )}

                {activeBranchId && (
                  <WorkingDaysDisplay
                    staffId={staffId}
                    branchId={activeBranchId}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
