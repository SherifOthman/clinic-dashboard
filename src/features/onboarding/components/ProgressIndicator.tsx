import { Building2, CheckCircle, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-12">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep >= 1
                  ? "bg-primary border-primary text-primary-foreground shadow-lg"
                  : "bg-content1 border-default-300 text-default-400"
              }`}
            >
              {currentStep > 1 ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Building2 className="w-6 h-6" />
              )}
            </div>
            <div className="text-left">
              <div
                className={`font-semibold ${currentStep >= 1 ? "text-primary" : "text-default-400"}`}
              >
                {t("onboarding.progress.step1")}
              </div>
              <div
                className={`text-sm ${currentStep >= 1 ? "text-foreground" : "text-default-400"}`}
              >
                {t("onboarding.progress.clinicAndPlan")}
              </div>
            </div>
          </div>

          <div className="w-24 h-1 bg-default-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentStep >= 2 ? "bg-primary w-full" : "bg-default-200 w-0"
              }`}
            />
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep >= 2
                  ? "bg-primary border-primary text-primary-foreground shadow-lg"
                  : "bg-content1 border-default-300 text-default-400"
              }`}
            >
              <MapPin className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div
                className={`font-semibold ${currentStep >= 2 ? "text-primary" : "text-default-400"}`}
              >
                {t("onboarding.progress.step2")}
              </div>
              <div
                className={`text-sm ${currentStep >= 2 ? "text-foreground" : "text-default-400"}`}
              >
                {t("onboarding.progress.branchDetails")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
