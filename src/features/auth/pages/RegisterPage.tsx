import { useTranslation } from "react-i18next";

import { RouterLink } from "@/core/components/ui/RouterLink";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <>
      <AuthHeader
        subtitle={t("auth.register.subtitle")}
        title={t("auth.register.title")}
      />
      <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg">
        <RegisterForm />

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
