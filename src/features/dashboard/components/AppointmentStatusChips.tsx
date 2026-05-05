import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";

interface AppointmentStatusChipsProps {
  pending: number;
  active: number;
  completed: number;
}

export function AppointmentStatusChips({
  pending,
  active,
  completed,
}: AppointmentStatusChipsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const num = (n: number) => isRTL ? toArabicNumerals(String(n)) : String(n);

  return (
    <div className="flex flex-wrap gap-3 px-5 pb-3">
      <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
        {num(pending)} {t("appointments.status.pending")}
      </span>
      {active > 0 && (
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          {num(active)} {t("appointments.status.inprogress")}
        </span>
      )}
      <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
        {num(completed)} {t("appointments.status.completed")}
      </span>
    </div>
  );
}
