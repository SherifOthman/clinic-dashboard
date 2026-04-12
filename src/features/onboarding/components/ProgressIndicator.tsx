import { Separator } from "@heroui/react";
import { Building2, Check, Hospital, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/core/utils";

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const { t } = useTranslation();

  const steps = [
    {
      label: t("onboarding.progress.step1"),
      description: t("onboarding.progress.clinicAndPlan"),
      icon: Building2,
    },
    {
      label: t("onboarding.progress.step2"),
      description: t("onboarding.progress.branchDetails"),
      icon: MapPin,
    },
    {
      label: t("onboarding.progress.step3"),
      description: t("onboarding.progress.medicalServices"),
      icon: Hospital,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          const Icon = step.icon;

          return (
            <div key={index} className="flex items-center">
              {/* Step */}
              <div className="flex flex-col items-center">
                {/* Icon/Number */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    isCompleted || isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-default-100 text-default-400",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isActive || isCompleted
                        ? "text-foreground"
                        : "text-default-400",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-default-500 mt-1 max-w-[120px]">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="px-8 pb-8">
                  <Separator
                    className={cn(
                      "w-24",
                      isCompleted ? "bg-primary" : "bg-default-200",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

