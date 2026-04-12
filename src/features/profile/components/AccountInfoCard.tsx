import { Card, Chip } from "@heroui/react";
import {
  AlertTriangle,
  CheckCircle,
  User as PersonIcon,
  Stethoscope,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { User } from "../../auth/types";

interface AccountInfoCardProps {
  user: User;
}

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const specialization = isAr
    ? user.specializationNameAr
    : user.specializationNameEn;
  const isDoctor = user.roles.includes("Doctor");

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
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <Chip key={index} color="accent" size="sm">
                    {t(`staff.roles.${role}`, { defaultValue: role })}
                  </Chip>
                ))
              ) : (
                <span className="text-foreground-500 text-sm">
                  {t("common.notProvided")}
                </span>
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
                <span className="text-foreground-500 text-sm">
                  {t("common.notProvided")}
                </span>
              )}
            </div>
          )}

          {/* Email status */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {user.emailConfirmed ? (
                <CheckCircle className="text-success h-4 w-4" />
              ) : (
                <AlertTriangle className="text-warning h-4 w-4" />
              )}
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
              {user.emailConfirmed
                ? t("profile.verified")
                : t("profile.notVerified")}
            </Chip>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

