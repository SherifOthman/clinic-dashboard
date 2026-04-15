import { useMe } from "@/features/auth/hooks";
import { ScheduleTab } from "@/features/staff/components/ScheduleTab";
import { useStaffDetail } from "@/features/staff/staffHooks";
import { Tabs } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { AccountInfoCard } from "./components/AccountInfoCard";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileImageCard } from "./components/ProfileImageCard";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useMe();

  if (!user) return null;

  const isDoctor = user.roles.includes("Doctor");

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">{t("profile.title")}</h1>
        <p className="text-default-500 text-sm">{t("profile.subtitle")}</p>
      </div>

      {isDoctor && user.staffId ? (
        <DoctorProfilePage user={user} staffId={user.staffId} />
      ) : (
        <ProfileContent user={user} />
      )}
    </div>
  );
}

function DoctorProfilePage({
  user,
  staffId,
}: {
  user: NonNullable<ReturnType<typeof useMe>["user"]>;
  staffId: string;
}) {
  const { t } = useTranslation();
  const { data: staffDetail } = useStaffDetail(staffId);
  const canSelfManage =
    staffDetail?.doctorProfile?.canSelfManageSchedule ?? true;

  return (
    <Tabs defaultSelectedKey="profile">
      <Tabs.ListContainer>
        <Tabs.List aria-label={t("profile.tabs")}>
          <Tabs.Tab id="profile">
            {t("profile.tabProfile")}
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="schedule">
            {t("profile.tabSchedule")}
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>

      <Tabs.Panel id="profile" className="pt-6">
        <ProfileContent user={user} />
      </Tabs.Panel>

      <Tabs.Panel id="schedule" className="pt-6">
        <div className="max-w-xl">
          <ScheduleTab
            staffId={staffId}
            isOwner={false}
            canSelfManageSchedule={canSelfManage}
          />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}

function ProfileContent({
  user,
}: {
  user: NonNullable<ReturnType<typeof useMe>["user"]>;
}) {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[300px_1fr]">
        <ProfileImageCard user={user} />
        <ProfileForm user={user} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChangePasswordForm />
        <AccountInfoCard user={user} />
      </div>
    </>
  );
}
