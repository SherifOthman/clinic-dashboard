import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Building2, CheckCircle, Crown, Users } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { LanguageSwitcher } from "@/core/components/LanguageSwitcher";
import { Loading } from "@/core/components/Loading";
import { ThemeSwitch } from "@/core/components/ThemeSwitch";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function OnboardingSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If user is not authenticated or onboarding is not completed, redirect
    if (!isLoading && (!user || !user.onboardingCompleted)) {
      navigate("/onboarding", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <Loading />;

  if (!user || !user.onboardingCompleted) {
    return null; // Will redirect via useEffect
  }

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 to-primary-50 relative">
      {/* Theme Switch and Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitch />
      </div>

      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-success rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              🎉 {t("onboarding.success.title")}
            </h1>
            <p className="text-xl text-default-600 max-w-lg mx-auto">
              {t("onboardingSuccess.clinicSetup")}{" "}
              <span className="font-semibold text-primary">
                {user.clinicName}
              </span>{" "}
              {t("onboardingSuccess.readyToGo")}
            </p>
          </div>

          {/* Clinic Information Card */}
          <Card className="shadow-xl border-0 bg-content1/90 backdrop-blur-sm">
            <CardBody className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-foreground">
                      {user.clinicName}
                    </h2>
                    <p className="text-default-600">
                      {t("onboardingSuccess.clinicActive")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">
                        {t("onboardingSuccess.readyForUsers")}
                      </span>
                    </div>
                    <p className="text-sm text-default-600">
                      {t("onboardingSuccess.startManaging")}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-success-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-semibold text-success">
                        {t("onboardingSuccess.freeTrial")}
                      </span>
                    </div>
                    <p className="text-sm text-default-600">
                      {t("onboardingSuccess.exploreFeatures")}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Next Steps */}
          <Card className="shadow-lg border-0 bg-content1/80 backdrop-blur-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t("onboardingSuccess.whatsNext")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-default-50 rounded-lg">
                  <div className="font-medium text-foreground mb-1">
                    {t("onboardingSuccess.step1Title")}
                  </div>
                  <div className="text-default-600">
                    {t("onboardingSuccess.step1Description")}
                  </div>
                </div>
                <div className="text-center p-3 bg-default-50 rounded-lg">
                  <div className="font-medium text-foreground mb-1">
                    {t("onboardingSuccess.step2Title")}
                  </div>
                  <div className="text-default-600">
                    {t("onboardingSuccess.step2Description")}
                  </div>
                </div>
                <div className="text-center p-3 bg-default-50 rounded-lg">
                  <div className="font-medium text-foreground mb-1">
                    {t("onboardingSuccess.step3Title")}
                  </div>
                  <div className="text-default-600">
                    {t("onboardingSuccess.step3Description")}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              color="primary"
              size="lg"
              className="px-12 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onPress={handleContinue}
            >
              {t("onboardingSuccess.goToDashboard")}
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-default-500 max-w-md mx-auto">
            {t("onboardingSuccess.helpNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
