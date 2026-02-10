import { useDateFormat } from "@/core/hooks/useDateFormat";
import type { User } from "@/features/auth/types";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useTranslation } from "react-i18next";

interface AccountInfoCardProps {
  user: User;
}

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  const { t } = useTranslation();
  const { formatDateShort } = useDateFormat();

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{t("profile.accountInfo")}</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-default-700">
              {t("profile.accountType")}
            </span>
            <p className="text-default-600">{user.roles.join(", ")}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-default-700">
              {t("profile.memberSince")}
            </span>
            <p className="text-default-600 table-date-cell">
              {formatDateShort(user.createdAt)}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-default-700">
              {t("profile.emailStatus")}
            </span>
            <p className="text-default-600">
              {user.emailConfirmed
                ? t("profile.verified")
                : t("profile.pendingVerification")}
            </p>
          </div>
          {user.clinicName && (
            <div>
              <span className="text-sm font-medium text-default-700">
                {t("profile.clinic")}
              </span>
              <p className="text-default-600">{user.clinicName}</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
