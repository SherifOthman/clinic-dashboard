import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/**
 * Empty state shown when there are no appointments today.
 * Displays a calendar icon + message + link to appointments page.
 */
export function AppointmentListEmpty() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
      <Calendar className="h-10 w-10 text-default-300" />
      <p className="text-sm text-default-400">{t("appointments.noAppointmentsToday")}</p>
      <Link to="/appointments" className="text-sm text-accent hover:underline">
        {t("appointments.goToAppointments")}
      </Link>
    </div>
  );
}
