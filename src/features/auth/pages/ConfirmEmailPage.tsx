import { Loading, RouterLink } from "@/core/components/ui";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { useConfirmEmail } from "@/features/auth/hooks";
import { Button, Card } from "@heroui/react";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ConfirmEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const confirmEmail = useConfirmEmail();

  useEffect(() => {
    if (userId && token) {
      confirmEmail.mutate(
        { userId, token },
        {
          onSuccess: () => {
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          },
        },
      );
    }
  }, [userId, token]);

  const handleResendEmail = () => {
    // We don't have the email here — direct user to the resend page
    navigate("/resend-email-verification");
  };

  if (!userId || !token) {
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
            <div className="mb-6 flex justify-center">
              <div className="bg-danger/10 flex h-16 w-16 items-center justify-center rounded-full">
                <XCircle className="text-danger h-8 w-8" />
              </div>
            </div>

            <p className="text-default-600 mb-6 text-center">
              {t("auth.emailVerification.verificationFailedMessage")}
            </p>

            <div className="space-y-4">
              <Button
                size="lg"
                variant="primary"
                fullWidth
                onPress={handleResendEmail}
              >
                {t("auth.emailVerification.resend")}
              </Button>
            </div>

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
