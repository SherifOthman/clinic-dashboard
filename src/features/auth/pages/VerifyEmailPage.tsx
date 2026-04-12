import { RouterLink } from "@/core/components/ui";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { useResendEmailVerification } from "@/features/auth/hooks";
import { Button, Card, Link } from "@heroui/react";
import { CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const { email } = useParams<{ email: string }>();
  const [resendCount, setResendCount] = useState(0);
  const resendMutation = useResendEmailVerification();

  const handleResendEmail = () => {
    if (!email) return;
    resendMutation.mutate(
      { email: decodeURIComponent(email) },
      { onSuccess: () => setResendCount((prev) => prev + 1) },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader
          title={t("auth.emailVerification.checkEmail")}
          subtitle={t("auth.emailVerification.verificationSent")}
        />
        <Card className="mt-6 p-6">
          {/* Icon Section */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                <Mail className="text-primary h-8 w-8" />
              </div>
              <div className="bg-success border-background absolute -inset-e-0.5 -bottom-0.5 flex h-7 w-7 items-center justify-center rounded-full border-3">
                <CheckCircle className="text-success-foreground h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Email Display */}
          <div className="mb-6 text-center">
            <p className="text-default-500 mb-2 text-sm">
              {t("auth.emailVerification.verificationSent")}
            </p>
            <h3 className="text-foreground text-lg font-semibold break-all">
              {email
                ? decodeURIComponent(email)
                : t("auth.emailVerification.yourEmail")}
            </h3>
          </div>

          {/* Instructions */}
          <div className="bg-default-50 mb-6 space-y-2 rounded-lg p-4">
            <p className="text-default-700 text-sm">
              {t("auth.emailVerification.clickLinkMessage")}
            </p>
            <p className="text-default-600 text-sm">
              {t("auth.emailVerification.didntReceive")}{" "}
              {t("auth.emailVerification.checkSpam")}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              size="lg"
              variant="primary"
              fullWidth
              onPress={handleResendEmail}
              isPending={resendMutation.isPending}
            >
              {t("auth.emailVerification.resend")}
            </Button>

            {resendCount > 0 && (
              <div className="text-success flex items-center justify-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>
                  {t("auth.emailVerification.emailSent")} ({resendCount}{" "}
                  {resendCount > 1 ? t("common.times") : t("common.time")})
                </span>
              </div>
            )}

            {resendMutation.isError && (
              <p className="text-danger text-center text-sm">
                {t("common.somethingWentWrong")}
              </p>
            )}
          </div>

          {/* Footer Links */}
          <div className="border-default-200 mt-8 space-y-4 border-t pt-6">
            <div className="text-center">
              <RouterLink to="/login">
                {t("auth.forgotPassword.backToLogin")}
              </RouterLink>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-default-500 text-xs">
                {t("auth.emailVerification.needHelp")}
              </p>
              <Link
                href="mailto:support@clinicmanagement.com"
                className="text-primary text-xs hover:underline"
              >
                support@clinicmanagement.com
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
