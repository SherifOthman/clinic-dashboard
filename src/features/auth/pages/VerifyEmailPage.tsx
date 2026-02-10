import { RouterLink } from "@/core/components/ui/RouterLink";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { useResendEmailVerification } from "@/features/auth/hooks/useAuthMutations";
import { Button } from "@heroui/button";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const { email } = useParams();
  const [resendCount, setResendCount] = useState(0);
  const resendMutation = useResendEmailVerification();

  const handleResendEmail = async () => {
    if (!email) return;
    await resendMutation.mutateAsync({ email: decodeURIComponent(email) });
    setResendCount((prev) => prev + 1);
  };

  return (
    <>
      <AuthHeader
        title={t("auth.emailVerification.checkEmail")}
        subtitle={t("auth.emailVerification.verificationSent")}
      />
      <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 bg-background rounded-full p-1">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="font-semibold text-primary break-all">
            {email
              ? decodeURIComponent(email)
              : t("auth.emailVerification.yourEmail")}
          </p>

          <div className="space-y-2 text-sm text-default-600">
            <p>{t("auth.emailVerification.clickLinkMessage")}</p>
            <p>
              <strong>{t("auth.emailVerification.didntReceive")}</strong>{" "}
              {t("auth.emailVerification.checkSpam")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            color="primary"
            className="w-full"
            size="lg"
            onPress={handleResendEmail}
            isLoading={resendMutation.isPending}
            isDisabled={!email}
            startContent={
              !resendMutation.isPending && <RefreshCw className="w-4 h-4" />
            }
          >
            {resendMutation.isPending
              ? t("auth.emailVerification.sending")
              : t("auth.emailVerification.resend")}
          </Button>

          {resendCount > 0 && (
            <p className="text-sm text-success">
              ✓ {t("auth.emailVerification.emailSent")} ({resendCount}{" "}
              {resendCount > 1 ? t("common.times") : t("common.time")})
            </p>
          )}

          {resendMutation.isError && (
            <p className="text-sm text-danger">
              {t("common.somethingWentWrong")}
            </p>
          )}

          <div className="text-center mt-6">
            <RouterLink color="primary" to="/login" size="sm">
              {t("auth.forgotPassword.backToLogin")}
            </RouterLink>
          </div>

          <div className="text-xs text-default-500 space-y-1 mt-6">
            <p>{t("auth.emailVerification.needHelp")}</p>
            <a
              href="mailto:support@clinicmanagement.com"
              className="text-primary"
            >
              support@clinicmanagement.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
