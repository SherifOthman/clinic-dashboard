import { DashboardStats } from "./DashboardStats";
import { RecentPatients } from "./RecentPatients";

// Clinic Owner dashboard
export function ClinicDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardStats />
      <RecentPatients />
    </div>
  );
}

