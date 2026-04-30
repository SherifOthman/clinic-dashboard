import { PageHeader } from "@/core/components/ui/PageHeader";
import {
  isClinicOwner,
  isDoctor,
  isReceptionist,
  isSuperAdmin,
} from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { useTranslation } from "react-i18next";
import { ClinicDashboard } from "./components/ClinicDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { ReceptionistDashboard } from "./components/ReceptionistDashboard";
import { SuperAdminDashboard } from "./components/SuperAdminDashboard";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useMe();

  const subtitle = isSuperAdmin(user)
    ? t("dashboard.subtitleSuperAdmin")
    : t("dashboard.welcome");

  const renderDashboard = () => {
    if (isSuperAdmin(user)) return <SuperAdminDashboard />;
    if (isClinicOwner(user)) return <ClinicDashboard />;
    if (isDoctor(user)) return <DoctorDashboard />;
    if (isReceptionist(user)) return <ReceptionistDashboard />;
    return null;
  };

  return (
    <div>
      <PageHeader title={t("dashboard.title")} subtitle={subtitle} />
      {renderDashboard()}
    </div>
  );
}
