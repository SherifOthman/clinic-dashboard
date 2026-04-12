import {
  isClinicOwner,
  isDoctor,
  isReceptionist,
  isSuperAdmin,
} from "@/core/utils/roleUtils";
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
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">{t("dashboard.title")}</h1>
        <p className="text-default-600">{subtitle}</p>
      </div>
      {renderDashboard()}
    </div>
  );
}
