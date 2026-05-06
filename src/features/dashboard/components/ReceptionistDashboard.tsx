import { useBranches } from "@/features/branches/branchesHooks";
import { useTranslation } from "react-i18next";
import { useBranchTodayAppointments } from "../dashboardHooks";
import { AppointmentStatsGrid } from "./AppointmentStatsGrid";
import { TodayAppointmentsList } from "./TodayAppointmentsList";
import type { AppointmentDto } from "../../appointments/types";

function countByStatus(appointments: AppointmentDto[]) {
  return {
    total:      appointments.length,
    pending:    appointments.filter((a) => a.status === "Pending" || a.status === "Waiting").length,
    inProgress: appointments.filter((a) => a.status === "InProgress").length,
    completed:  appointments.filter((a) => a.status === "Completed").length,
  };
}

/**
 * Dashboard view for the Receptionist role.
 * Shows all branch appointments for today — including doctor names.
 */
export function ReceptionistDashboard() {
  const { t } = useTranslation();
  const { data: branches = [] } = useBranches();

  const branchId = branches[0]?.id;
  const { data: appointments = [], isLoading } = useBranchTodayAppointments(branchId);
  const { total, pending, inProgress, completed } = countByStatus(appointments);

  return (
    <div className="flex flex-col gap-6">
      <AppointmentStatsGrid
        total={total}
        pending={pending}
        inProgress={inProgress}
        completed={completed}
        isLoading={isLoading}
      />
      <TodayAppointmentsList
        appointments={appointments}
        isLoading={isLoading}
        title={t("dashboard.branchAppointmentsToday")}
        showDoctor
      />
    </div>
  );
}
