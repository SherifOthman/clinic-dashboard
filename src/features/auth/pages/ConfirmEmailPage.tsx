import { Button } from "@heroui/button";
import { CheckCircle, Mail, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { RouterLink } from "@/core/components/ui/RouterLink";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { useConfirmEmail } from "@/features/auth/hooks/useAuthMutations";

export default function ConfirmEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const hasConfirmed = useRef(false);

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const { mutateAsync: confirmEmailAsync } = useConfirmEmail();

  useEffect(() => {
    if (hasConfirmed.current) return;

    const confirmEmail = async () => {
      if (email && token) {
        hasConfirmed.current = true;
        try {
          await confirmEmailAsync({ email, token });
          setStatus("success");
        } catch {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
    };

    confirmEmail();
  }, [email, token]);

  if (status === "loading") {
    return (
      <>
        <AuthHeader
          subtitle={t("auth.emailVerification.pleaseWait")}
          title={t("auth.emailVerification.confirming")}
        />
        <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-default-600">
            {t("auth.emailVerification.verifying")}
          </p>
        </div>
      </>
    );
  }

  if (status === "success") {
    return (
      <>
        <AuthHeader
          subtitle={t("auth.emailVerification.successMessage")}
          title={t("auth.emailVerification.confirmed")}
        />
        <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <p className="text-default-600 mb-6">
            {t("auth.emailVerification.welcomeMessage")}
          </p>
          <div className="space-y-3">
            <Button
              as={RouterLink}
              className="w-full hover:text-white"
              color="primary"
              to="/login"
              size="lg"
            >
              {t("auth.emailVerification.completeSetup")}
            </Button>
            <p className="text-sm text-default-600">
              <RouterLink color="primary" to="/login">
                {t("auth.emailVerification.signInLater")}
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
        subtitle={t("auth.emailVerification.failedMessage")}
        title={t("auth.emailVerification.confirmationFailed")}
      />
      <div className="bg-content1 p-8 rounded-2xl border border-divider shadow-lg text-center">
        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-danger" />
        </div>
        <p className="text-default-600 mb-6">
          {t("auth.emailVerification.failedDescription")}
        </p>
        <div className="space-y-3">
          <Button
            as={RouterLink}
            className="w-full"
            color="primary"
            to="/register"
            size="lg"
          >
            {t("auth.register.registerAgain")}
          </Button>
          <Button
            as={RouterLink}
            className="w-full"
            variant="light"
            to="/resend-email-verification"
            size="lg"
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
