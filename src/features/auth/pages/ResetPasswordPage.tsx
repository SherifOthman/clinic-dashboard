import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { RouterLink } from "@/core/components/ui/RouterLink";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  if (!email || !token) {
    return (
      <>
        <AuthHeader
          subtitle={t("auth.resetPassword.invalidLink.subtitle")}
          title={t("auth.resetPassword.invalidLink.title")}
        />
        <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg text-center">
          <p className="text-default-600 mb-6">
            {t("auth.resetPassword.invalidLink.message")}
          </p>
          <div className="space-y-3">
            <RouterLink color="primary" to="/forgot-password">
              {t("auth.resetPassword.invalidLink.requestNewLink")}
            </RouterLink>
            <p className="text-sm text-default-600">
              <RouterLink color="primary" to="/login">
                {t("auth.resetPassword.invalidLink.backToSignIn")}
              </RouterLink>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeader
        subtitle={t("auth.resetPassword.subtitle")}
        title={t("auth.resetPassword.title")}
      />
      <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg">
        <ResetPasswordForm email={email} token={token} />

        <div className="text-center mt-6">
          <p className="text-sm text-default-600">
            {t("auth.resetPassword.rememberPassword")}{" "}
            <RouterLink color="primary" to="/login">
              {t("auth.resetPassword.signIn")}
            </RouterLink>
          </p>
        </div>
      </div>
    </>
  );
}
