import { PageHeader } from "@/core/components/ui/PageHeader";
import { useMe } from "@/features/auth/hooks";
import { isClinicOwner } from "@/core/utils/permissions";
import { ScheduleTab } from "@/features/staff/components/ScheduleTab";
import { useStaffDetail } from "@/features/staff/staffHooks";
import { Tabs } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileImageCard } from "./components/ProfileImageCard";
import { AccountInfoCard } from "./components/AccountInfoCard";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { WeekStartDayCard } from "@/features/settings/components/WeekStartDayCard";
import { TestimonialForm } from "@/features/dashboard/components/TestimonialForm";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useMe();

  if (!user) return null;

  const isDoctor = user.roles.includes("Doctor");
  const isOwner = isClinicOwner(user);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t("profile.title")} subtitle={t("profile.subtitle")} />

      <Tabs defaultSelectedKey="profile">
        <Tabs.ListContainer>
          <Tabs.List aria-label={t("profile.tabs")}>
            <Tabs.Tab id="profile">
              {t("profile.tabProfile")}
              <Tabs.Indicator />
            </Tabs.Tab>
            {isDoctor && (
              <Tabs.Tab id="schedule">
                {t("profile.tabSchedule")}
                <Tabs.Indicator />
              </Tabs.Tab>
            )}
            <Tabs.Tab id="settings">
              {t("navigation.settings")}
              <Tabs.Indicator />
            </Tabs.Tab>
            {isOwner && (
              <Tabs.Tab id="reviews">
                {t("navigation.reviews")}
                <Tabs.Indicator />
              </Tabs.Tab>
            )}
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="profile" className="pt-6">
          <ProfileContent user={user} />
        </Tabs.Panel>

        {isDoctor && user.staffId && (
          <Tabs.Panel id="schedule" className="pt-6">
            <ScheduleTabWithData user={user} staffId={user.staffId} />
          </Tabs.Panel>
        )}

        <Tabs.Panel id="settings" className="pt-6">
          <div className="flex flex-col gap-6">
            <section>
              <h2 className="mb-3 text-base font-semibold text-foreground">
                {t("settings.sections.account")}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AccountInfoCard user={user} />
                {user.hasPassword && <ChangePasswordForm />}
              </div>
            </section>
            {isOwner && (
              <section>
                <h2 className="mb-3 text-base font-semibold text-foreground">
                  {t("settings.sections.clinic")}
                </h2>
                <WeekStartDayCard />
              </section>
            )}
          </div>
        </Tabs.Panel>

        {isOwner && (
          <Tabs.Panel id="reviews" className="pt-6">
            <div className="mx-auto max-w-lg">
              <TestimonialForm />
            </div>
          </Tabs.Panel>
        )}
      </Tabs>
    </div>
  );
}

// ── Shared profile content (personal info only) ───────────────────────────────

function ProfileContent({
  user,
}: {
  user: NonNullable<ReturnType<typeof useMe>["user"]>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[280px_1fr]">
      <ProfileImageCard user={user} />
      <ProfileForm user={user} />
    </div>
  );
}

// ── Schedule Tab wrapper ─────────────────────────────────────────────────────

function ScheduleTabWithData({
  user,
  staffId,
}: {
  user: NonNullable<ReturnType<typeof useMe>["user"]>;
  staffId: string;
}) {
  const { data: staffDetail } = useStaffDetail(staffId);
  const canSelfManage =
    staffDetail?.doctorProfile?.canSelfManageSchedule ?? false;
  const memberId = staffId;
  const doctorInfoId = user.memberId;

  return (
    <ScheduleTab
      staffId={staffId}
      memberId={memberId}
      doctorInfoId={doctorInfoId}
      isOwner={false}
      canSelfManageSchedule={canSelfManage}
      isDoctorOwnProfile
    />
  );
}
