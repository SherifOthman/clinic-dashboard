import { RouterLink } from "@/core/components/ui";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { ResendEmailVerificationForm } from "@/features/auth/components/ResendEmailVerificationForm";
import { Button, Card } from "@heroui/react";
import { CheckCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function ResendEmailVerificationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const successMessage = searchParams.get("message");

  if (success === "true") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader title={t("auth.emailVerification.checkEmail")} />
          <Card className="mt-6 p-8 text-center">
            <div className="bg-success-50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <CheckCircle className="text-success h-8 w-8" />
            </div>
            <p className="text-default-600 mb-6">{successMessage}</p>
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                variant="primary"
                fullWidth
                onPress={() => window.location.reload()}
              >
                {t("auth.emailVerification.resend")}
              </Button>
              <p className="text-default-600 text-sm">
                <RouterLink to="/login">
                  {t("auth.emailVerification.backToSignIn")}
                </RouterLink>
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader title={t("auth.emailVerification.resendPage.title")} />
        <Card className="mt-6 p-8">
          <div className="mb-6 text-center">
            <div className="bg-primary-50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Mail className="text-primary h-8 w-8" />
            </div>
            <p className="text-default-600">
              {t("auth.emailVerification.resendPage.message")}
            </p>
          </div>

          <ResendEmailVerificationForm />

          <div className="mt-6 text-center">
            <p className="text-default-600 text-sm">
              {t("auth.emailVerification.resendPage.alreadyVerified")}{" "}
              <RouterLink to="/login">{t("auth.login.signIn")}</RouterLink>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

