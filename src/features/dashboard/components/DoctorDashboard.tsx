import { StatsCard } from "@/core/components/ui/StatsCard";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DoctorDashboard() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <StatsCard
        title={t("dashboard.appointmentsToday")}
        value={t("common.comingSoon")}
        icon={<Calendar className="h-6 w-6" />}
        iconColor="text-accent"
        comingSoon
      />
      <StatsCard
        title={t("dashboard.upcomingAppointments")}
        value={t("common.comingSoon")}
        icon={<Clock className="h-6 w-6" />}
        iconColor="text-warning"
        comingSoon
      />
    </div>
  );
}

