import { useTranslation } from "react-i18next";

import { RouterLink } from "@/core/components/ui/RouterLink";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <>
      <AuthHeader
        subtitle={t("auth.forgotPassword.subtitle")}
        title={t("auth.forgotPassword.title")}
      />
      <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg">
        <ForgotPasswordForm />

        <div className="text-center mt-6">
          <p className="text-sm text-default-600">
            {t("auth.register.haveAccount")}{" "}
            <RouterLink color="primary" to="/login">
              {t("auth.register.signIn")}
            </RouterLink>
          </p>
        </div>
      </div>
    </>
  );
}
