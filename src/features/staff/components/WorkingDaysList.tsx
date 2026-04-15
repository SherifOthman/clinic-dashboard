import { useTranslation } from "react-i18next";
import { useWorkingDays } from "../staffHooks";

function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function dayLabel(day: number, locale: string) {
  const date = new Date(2024, 0, 7 + day);
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
}

export function WorkingDaysList({
  staffId,
  branchId,
}: {
  staffId: string;
  branchId: string;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-GB";
  const { data, isLoading } = useWorkingDays(staffId, branchId);

  const activeDays = data?.filter((d) => d.isAvailable) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-default-100 h-8 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (activeDays.length === 0) {
    return (
      <p className="text-default-400 text-sm">{t("staff.noWorkingDays")}</p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-dashed">
      {activeDays.map((d) => (
        <div
          key={d.day}
          className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
        >
          <span className="text-sm font-medium">{dayLabel(d.day, locale)}</span>
          <div className="flex items-center gap-3" dir="ltr">
            <span className="text-default-500 text-xs">
              {formatTime12h(d.startTime)} — {formatTime12h(d.endTime)}
            </span>
            {d.maxAppointmentsPerDay != null && (
              <span className="bg-default-100 text-default-500 rounded-md px-2 py-0.5 text-xs">
                {d.maxAppointmentsPerDay} {t("staff.maxAppointments")}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
