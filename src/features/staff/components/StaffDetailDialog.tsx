import { Dialog } from "@/core/components/ui/Dialog";
import { InfoRow } from "@/core/components/ui/InfoRow";
import { Loading } from "@/core/components/ui/Loading";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { getFileUrl } from "@/core/utils/fileUtils";
import { getLocalizedValue } from "@/core/utils/i18nUtils";
import { getGenderImageSrc } from "@/core/utils/patientImageUtils";
import { useMe } from "@/features/auth/hooks";
import { Avatar, Chip, Tabs } from "@heroui/react";
import { Briefcase, Calendar, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStaffDetail } from "../staffHooks";
import { ScheduleTab } from "./ScheduleTab";

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
  const { user } = useMe();
  const isOwner = user?.roles.includes("ClinicOwner") ?? false;

  const isDoctor = !!data?.doctorProfile;

  return (
    <Dialog isOpen={!!staffId} onClose={onClose} size={isDoctor ? "lg" : "md"}>
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

          {/* ── Tabs for doctors, plain info for non-doctors ── */}
          {isDoctor && staffId ? (
            <Tabs defaultSelectedKey="info">
              <Tabs.ListContainer>
                <Tabs.List aria-label={t("staff.tabs")}>
                  <Tabs.Tab id="info">
                    {t("staff.tabInfo")}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="schedule">
                    {t("staff.tabSchedule")}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              <Tabs.Panel id="info" className="pt-2">
                <ContactInfo
                  data={data}
                  isRTL={isRTL}
                  t={t}
                  formatDateShort={formatDateShort}
                />
              </Tabs.Panel>

              <Tabs.Panel id="schedule" className="pt-2">
                <ScheduleTab
                  staffId={staffId}
                  isOwner={isOwner}
                  canSelfManageSchedule={
                    data.doctorProfile?.canSelfManageSchedule ?? true
                  }
                />
              </Tabs.Panel>
            </Tabs>
          ) : (
            <ContactInfo
              data={data}
              isRTL={isRTL}
              t={t}
              formatDateShort={formatDateShort}
            />
          )}
        </div>
      ) : null}
    </Dialog>
  );
}

function ContactInfo({
  data,
  isRTL,
  t,
  formatDateShort,
}: {
  data: NonNullable<ReturnType<typeof useStaffDetail>["data"]>;
  isRTL: boolean;
  t: (key: string) => string;
  formatDateShort: (date: string) => string;
}) {
  return (
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
  );
}
