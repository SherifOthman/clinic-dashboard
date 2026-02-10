import { Button } from "@heroui/button";
import { CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { RouterLink } from "@/core/components/ui/RouterLink";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { ResendEmailVerificationForm } from "@/features/auth/components/ResendEmailVerificationForm";

export default function ResendEmailVerificationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const email = searchParams.get("email") || "";

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <>
        <AuthHeader
          subtitle={t("auth.emailVerification.verificationSent")}
          title={t("auth.emailVerification.checkEmail")}
        />
        <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <p className="text-default-600 mb-6">{successMessage}</p>
          <div className="space-y-3">
            <Button
              className="w-full"
              color="primary"
              size="lg"
              onPress={() => setIsSuccess(false)}
            >
              {t("auth.emailVerification.resend")}
            </Button>
            <p className="text-sm text-default-600">
              <RouterLink color="primary" to="/login">
                {t("auth.emailVerification.backToSignIn")}
              </RouterLink>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeader
        subtitle={t("auth.emailVerification.resendPage.subtitle")}
        title={t("auth.emailVerification.resendPage.title")}
      />
      <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <p className="text-default-600">
            {t("auth.emailVerification.resendPage.message")}
          </p>
        </div>

        <ResendEmailVerificationForm
          defaultEmail={email}
          onSuccess={handleSuccess}
        />

        <div className="text-center mt-6">
          <p className="text-sm text-default-600">
            {t("auth.emailVerification.resendPage.alreadyVerified")}{" "}
            <RouterLink color="primary" to="/login">
              {t("auth.emailVerification.resendPage.signIn")}
            </RouterLink>
          </p>
        </div>
      </div>
    </>
  );
}
