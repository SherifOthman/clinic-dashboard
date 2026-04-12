import { Card } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { RouterLink } from "@/core/components/ui";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <Card.Header>
            <Card.Title>{t("auth.resetPassword.invalidLink.title")}</Card.Title>
          </Card.Header>
          <Card.Content className="text-center">
            <p className="text-default-500 mb-6">
              {t("auth.resetPassword.invalidLink.message")}
            </p>
            <div className="flex flex-col gap-4">
              <RouterLink to="/forgot-password">
                {t("auth.resetPassword.invalidLink.requestNewLink")}
              </RouterLink>
              <p className="text-sm text-default-500">
                <RouterLink to="/login">
                  {t("auth.resetPassword.invalidLink.backToSignIn")}
                </RouterLink>
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <ResetPasswordForm email={email} token={token} />
      <div className="text-center mt-6">
        <p className="text-sm text-default-500">
          {t("auth.resetPassword.rememberPassword")}{" "}
          <RouterLink to="/login">{t("auth.login.signIn")}</RouterLink>
        </p>
      </div>
    </div>
  );
}

