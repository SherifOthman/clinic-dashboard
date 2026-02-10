import { LanguageSwitcher } from "@/core/components/LanguageSwitcher";
import { ThemeSwitch } from "@/core/components/ThemeSwitch";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function OnboardingHeader() {
  const { t } = useTranslation();

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitch />
      </div>

      <div className="bg-content1 shadow-sm border-b border-divider">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                {t("onboarding.header.title")}
              </h1>
            </div>
            <p className="text-lg text-default-600 max-w-2xl mx-auto">
              {t("onboarding.header.subtitle")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
