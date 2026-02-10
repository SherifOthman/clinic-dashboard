import { RouterLink } from "@/core/components/ui/RouterLink";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Button } from "@heroui/button";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PasswordChangedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <AuthHeader
        title={t("passwordChanged.title")}
        subtitle={t("passwordChanged.subtitle")}
      />
      <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>

        <p className="text-default-600 mb-6">{t("passwordChanged.message")}</p>

        <div className="space-y-4">
          <Button
            onClick={handleGoToLogin}
            className="w-full"
            color="primary"
            size="lg"
          >
            {t("passwordChanged.goToLogin")}
          </Button>

          <p className="text-sm text-default-500">
            {t("passwordChanged.autoRedirect")}
          </p>

          <div className="text-center mt-6">
            <RouterLink color="primary" to="/login" size="sm">
              {t("auth.emailVerification.backToSignIn")}
            </RouterLink>
          </div>
        </div>
      </div>
    </>
  );
}
