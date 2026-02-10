import { useTranslation } from "react-i18next";

import { RouterLink } from "@/core/components/ui/RouterLink";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { LoginForm } from "@/features/auth/components/LoginForm";

/**
 * Login page - minimal layout with component composition
 */
export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <>
      <AuthHeader
        subtitle={t("auth.login.subtitle")}
        title={t("auth.login.title")}
      />

      <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg">
        <LoginForm />

        <div className="text-center mt-6 space-y-4">
          <RouterLink color="primary" to="/forgot-password" size="sm">
            {t("auth.login.forgotPassword")}
          </RouterLink>

          <p className="text-sm text-default-600">
            {t("auth.login.noAccount")}{" "}
            <RouterLink color="primary" to="/register">
              {t("auth.login.signUp")}
            </RouterLink>
          </p>
        </div>
      </div>
    </>
  );
}
