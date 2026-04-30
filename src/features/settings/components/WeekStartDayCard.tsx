import { Card } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useMe } from "@/features/auth/hooks";
import { useUpdateClinicSettings } from "../settingsHooks";

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

function dayLabel(day: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    new Date(2024, 0, 7 + day), // 2024-01-07 = Sunday
  );
}

export function WeekStartDayCard() {
  const { t, i18n } = useTranslation();
  const { user } = useMe();
  const updateSettings = useUpdateClinicSettings();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-GB";
  const current = user?.weekStartDay ?? 6;

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t("settings.weekStartDay.title")}</Card.Title>
        <Card.Description>{t("settings.weekStartDay.description")}</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ALL_DAYS.map((day) => (
            <button
              key={day}
              type="button"
              disabled={updateSettings.isPending}
              onClick={() =>
                day !== current && updateSettings.mutate({ weekStartDay: day })
              }
              className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all disabled:opacity-50 ${
                current === day
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {dayLabel(day, locale)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          {t("settings.weekStartDay.current", {
            day: dayLabel(current, locale),
          })}
        </p>
      </Card.Content>
    </Card>
  );
}
