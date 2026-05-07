import { Building2, Check, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
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
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          const Icon = step.icon;

          return (
            <div key={index} className="flex items-center">
              {/* Step bubble + label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "border-accent bg-accent text-accent-foreground"
                      : isActive
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-surface text-muted",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={cn(
                    "text-xs font-semibold",
                    isActive || isCompleted ? "text-foreground" : "text-muted",
                  )}>
                    {step.label}
                  </p>
                  <p className="mt-0.5 max-w-[100px] text-xs text-muted">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "mx-4 mb-8 h-0.5 w-24 transition-all duration-300",
                  isCompleted ? "bg-accent" : "bg-border",
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
