import { useBranches } from "@/features/branches/branchesHooks";
import { DashboardStats } from "./DashboardStats";
import { RecentPatients } from "./RecentPatients";
import { TodayAppointmentsList } from "./TodayAppointmentsList";
import { useBranchTodayAppointments } from "../dashboardHooks";
import { useTranslation } from "react-i18next";

// Clinic Owner dashboard
export function ClinicDashboard() {
  const { t } = useTranslation();
  const { data: branches = [] } = useBranches();
  const branchId = branches[0]?.id;
  const { data: appointments = [], isLoading } = useBranchTodayAppointments(branchId);

  return (
    <div className="flex flex-col gap-6">
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TodayAppointmentsList
          appointments={appointments}
          isLoading={isLoading}
          title={t("dashboard.todayAppointments")}
          showDoctor
        />
        <RecentPatients />
      </div>
    </div>
  );
}

