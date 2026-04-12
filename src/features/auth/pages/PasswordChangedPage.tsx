import { RouterLink } from "@/core/components/ui";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Button, Card } from "@heroui/react";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PasswordChangedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      navigate("/login");
    }, 5000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader
          title={t("passwordChanged.title")}
          subtitle={t("passwordChanged.subtitle")}
        />
        <Card className="mt-6 p-8 text-center">
          <div className="bg-success-50 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle className="text-success h-8 w-8" />
          </div>

          <p className="text-default-600 mb-6">
            {t("passwordChanged.message")}
          </p>

          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              variant="primary"
              fullWidth
              onPress={handleGoToLogin}
            >
              {t("passwordChanged.goToLogin")}
            </Button>

            <p className="text-default-600 text-sm">
              {t("passwordChanged.autoRedirect")}
            </p>

            <div className="mt-4">
              <RouterLink to="/login">
                {t("auth.emailVerification.backToSignIn")}
              </RouterLink>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

