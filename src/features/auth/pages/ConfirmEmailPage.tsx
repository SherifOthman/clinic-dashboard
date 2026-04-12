import { Loading, RouterLink } from "@/core/components/ui";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import {
  useConfirmEmail,
  useResendEmailVerification,
} from "@/features/auth/hooks";
import { Button, Card } from "@heroui/react";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ConfirmEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const confirmEmail = useConfirmEmail();
  const resendMutation = useResendEmailVerification();
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    if (email && token) {
      confirmEmail.mutate(
        { email, token },
        {
          onSuccess: () => {
            // Redirect to login after successful confirmation
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          },
        },
      );
    }
  }, [email, token]);

  const handleResendEmail = () => {
    if (!email) return;
    resendMutation.mutate(
      { email },
      { onSuccess: () => setResendCount((prev) => prev + 1) },
    );
  };

  if (!email || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader title={t("auth.emailVerification.invalidLink")} />
          <Card className="mt-6 p-6">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="bg-danger/10 flex h-16 w-16 items-center justify-center rounded-full">
                <XCircle className="text-danger h-8 w-8" />
              </div>
            </div>

            {/* Error Message */}
            <p className="text-default-600 mb-6 text-center">
              {t("auth.emailVerification.invalidLinkMessage")}
            </p>

            {/* Back to Login Button */}
            <Button
              size="lg"
              variant="primary"
              fullWidth
              onPress={() => navigate("/login")}
            >
              {t("auth.forgotPassword.backToLogin")}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (confirmEmail.isPending) {
    return <Loading className="h-screen" />;
  }

  if (confirmEmail.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader title={t("auth.emailVerification.verificationFailed")} />
          <Card className="mt-6 p-6">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="bg-danger/10 flex h-16 w-16 items-center justify-center rounded-full">
                <XCircle className="text-danger h-8 w-8" />
              </div>
            </div>

            {/* Error Message */}
            <p className="text-default-600 mb-4 text-center">
              {t("auth.emailVerification.verificationFailedMessage")}
            </p>

            {/* Email Display */}
            <div className="mb-6 text-center">
              <p className="text-default-500 mb-1 text-sm">
                {t("auth.emailVerification.verificationSent")}
              </p>
              <p className="text-foreground text-sm font-semibold break-all">
                {email}
              </p>
            </div>

            {/* Resend Button */}
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

            {/* Back to Login Link */}
            <div className="border-default-200 mt-6 border-t pt-6 text-center">
              <RouterLink to="/login">
                {t("auth.forgotPassword.backToLogin")}
              </RouterLink>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (confirmEmail.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader title={t("auth.emailVerification.success")} />
          <Card className="mt-6 p-6">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="bg-success/10 flex h-16 w-16 items-center justify-center rounded-full">
                <CheckCircle className="text-success h-8 w-8" />
              </div>
            </div>

            {/* Success Message */}
            <p className="text-default-600 mb-6 text-center">
              {t("auth.emailVerification.successMessage")}
            </p>

            {/* Go to Login Button */}
            <Button
              size="lg"
              variant="primary"
              fullWidth
              onPress={() => navigate("/login")}
            >
              {t("auth.emailVerification.goToLogin")}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
