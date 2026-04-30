import { useMe } from "@/features/auth/hooks";
import { isClinicOwner } from "@/core/utils/permissions";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { useTranslation } from "react-i18next";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";
import { AccountInfoCard } from "@/features/profile/components/AccountInfoCard";
import { TestimonialForm } from "@/features/dashboard/components/TestimonialForm";
import { WeekStartDayCard } from "./components/WeekStartDayCard";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useMe();

  if (!user) return null;

  const isOwner = isClinicOwner(user);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={t("navigation.settings")}
        subtitle={t("settings.subtitle")}
      />

      <div className="mt-6 flex flex-col gap-6">

        {/* ── Account & Security (all users) ─────────────────────────────── */}
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            {t("settings.sections.account")}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AccountInfoCard user={user} />
            {user.hasPassword && <ChangePasswordForm />}
          </div>
        </section>

        {/* ── Clinic Settings (owner only) ────────────────────────────────── */}
        {isOwner && (
          <section>
            <h2 className="mb-3 text-base font-semibold text-foreground">
              {t("settings.sections.clinic")}
            </h2>
            <div className="flex flex-col gap-4">
              <WeekStartDayCard />
            </div>
          </section>
        )}

        {/* ── Testimonial (owner only) ────────────────────────────────────── */}
        {isOwner && (
          <section>
            <h2 className="mb-3 text-base font-semibold text-foreground">
              {t("settings.sections.testimonial")}
            </h2>
            <TestimonialForm />
          </section>
        )}

      </div>
    </div>
  );
}
