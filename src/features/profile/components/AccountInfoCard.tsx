import { Card, Chip } from "@heroui/react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  KeyRound,
  User as PersonIcon,
  Stethoscope,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { User } from "../../auth/types";

interface AccountInfoCardProps {
  user: User;
}

/** Format a UTC ISO string as a relative time string, e.g. "2 hours ago". */
function useRelativeTime() {
  const { i18n } = useTranslation();
  return (iso: string | undefined): string | null => {
    if (!iso) return null;
    const date = new Date(iso);
    if (isNaN(date.getTime())) return null;

    const diffMs   = Date.now() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHrs  = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    const locale = i18n.language === "ar" ? "ar-EG" : "en";
    const rtf    = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (diffSecs < 60)  return rtf.format(-diffSecs, "second");
    if (diffMins < 60)  return rtf.format(-diffMins, "minute");
    if (diffHrs  < 24)  return rtf.format(-diffHrs,  "hour");
    if (diffDays < 30)  return rtf.format(-diffDays,  "day");

    // Older than 30 days — show the actual date
    return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  };
}

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  const { t, i18n } = useTranslation();
  const isAr         = i18n.language === "ar";
  const relativeTime = useRelativeTime();

  const specialization = isAr ? user.specializationNameAr : user.specializationNameEn;
  const isDoctor       = user.roles.includes("Doctor");

  return (
    <Card className="h-full">
      <Card.Header>
        <h3 className="text-lg font-semibold">{t("profile.accountInfo")}</h3>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-6">

          {/* Roles */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <PersonIcon className="text-default-500 h-4 w-4" />
              <span className="text-foreground-600 text-sm font-semibold">
                {t("profile.accountType")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.roles?.length > 0 ? (
                user.roles.map((role, index) => (
                  <Chip key={index} color="accent" size="sm">
                    {t(`staff.roles.${role}`, { defaultValue: role })}
                  </Chip>
                ))
              ) : (
                <span className="text-foreground-500 text-sm">{t("common.notProvided")}</span>
              )}
            </div>
          </div>

          {/* Specialization — doctors only */}
          {isDoctor && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="text-default-500 h-4 w-4" />
                <span className="text-foreground-600 text-sm font-semibold">
                  {t("common.fields.specialization")}
                </span>
              </div>
              {specialization ? (
                <Chip color="accent" variant="soft" size="sm" className="w-fit">
                  {specialization}
                </Chip>
              ) : (
                <span className="text-foreground-500 text-sm">{t("common.notProvided")}</span>
              )}
            </div>
          )}

          {/* Email status */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {user.emailConfirmed
                ? <CheckCircle className="text-success h-4 w-4" />
                : <AlertTriangle className="text-warning h-4 w-4" />}
              <span className="text-foreground-600 text-sm font-semibold">
                {t("profile.emailStatus")}
              </span>
            </div>
            <Chip
              variant="soft"
              color={user.emailConfirmed ? "success" : "warning"}
              size="sm"
              className="w-fit"
            >
              {user.emailConfirmed ? t("profile.verified") : t("profile.notVerified")}
            </Chip>
          </div>

          {/* Last sign-in */}
          {user.lastLoginAt && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Clock className="text-default-500 h-4 w-4" />
                <span className="text-foreground-600 text-sm font-semibold">
                  {t("profile.lastSignIn")}
                </span>
              </div>
              <span className="text-foreground-500 text-sm">
                {relativeTime(user.lastLoginAt) ?? "—"}
              </span>
            </div>
          )}

          {/* Last password change */}
          {user.lastPasswordChangeAt && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <KeyRound className="text-default-500 h-4 w-4" />
                <span className="text-foreground-600 text-sm font-semibold">
                  {t("profile.lastPasswordChange")}
                </span>
              </div>
              <span className="text-foreground-500 text-sm">
                {relativeTime(user.lastPasswordChangeAt) ?? "—"}
              </span>
            </div>
          )}

        </div>
      </Card.Content>
    </Card>
  );
}
