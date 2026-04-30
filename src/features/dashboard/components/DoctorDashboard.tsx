import { useMe } from "@/features/auth/hooks";
import { useBranches } from "@/features/branches/branchesHooks";
import { UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDoctorTodayAppointments } from "../dashboardHooks";
import { AppointmentStatsGrid } from "./AppointmentStatsGrid";
import { TodayAppointmentsList } from "./TodayAppointmentsList";

/**
 * Dashboard view for the Doctor role.
 * Shows today's appointment stats + the doctor's own appointment list.
 */
export function DoctorDashboard() {
  const { t } = useTranslation();
  const { user } = useMe();
  const { data: branches = [] } = useBranches();

  const branchId     = branches[0]?.id;
  const doctorInfoId = user?.staffId;

  const { data: appointments = [], isLoading } = useDoctorTodayAppointments(doctorInfoId, branchId);

  const total      = appointments.length;
  const pending    = appointments.filter((a) => a.status === "Pending" || a.status === "Waiting").length;
  const inProgress = appointments.filter((a) => a.status === "InProgress").length;
  const completed  = appointments.filter((a) => a.status === "Completed").length;

  return (
    <div className="flex flex-col gap-6">
      <AppointmentStatsGrid
        total={total}
        pending={pending}
        inProgress={inProgress}
        completed={completed}
        isLoading={isLoading}
        inProgressIcon={<UserRound className="h-6 w-6" />}
      />
      <TodayAppointmentsList
        appointments={appointments}
        isLoading={isLoading}
        title={t("dashboard.todayAppointments")}
        showDoctor={false}
      />
    </div>
  );
}
