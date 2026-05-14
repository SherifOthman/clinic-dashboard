import { cn } from "@/core/utils";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SubscriptionPlan } from "../types";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

export function SubscriptionPlanCard({
  plan,
  isSelected,
  onSelect,
}: SubscriptionPlanCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const planName = isRTL && plan.nameAr ? plan.nameAr : plan.name;
  const planDescription =
    isRTL && plan.descriptionAr ? plan.descriptionAr : plan.description;

  const features = [
    {
      text: `${plan.maxBranches === -1 ? t("common.unlimited") : plan.maxBranches} ${t("onboarding.subscription.features.branches")}`,
    },
    {
      text: `${plan.maxStaff === -1 ? t("common.unlimited") : plan.maxStaff} ${t("onboarding.subscription.features.staff")}`,
    },
    ...(plan.hasAdvancedReporting
      ? [{ text: t("onboarding.subscription.features.advancedReporting") }]
      : []),
    ...(plan.hasApiAccess
      ? [{ text: t("onboarding.subscription.features.apiAccess") }]
      : []),
    ...(plan.hasPrioritySupport
      ? [{ text: t("onboarding.subscription.features.prioritySupport") }]
      : []),
    ...(plan.hasCustomBranding
      ? [{ text: t("onboarding.subscription.features.customBranding") }]
      : []),
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(plan.id)}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && onSelect(plan.id)
      }
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-6 transition-all duration-200",
        isSelected
          ? "border-accent bg-accent/5 ring-accent/20 shadow-lg ring-2"
          : "border-border bg-surface hover:border-accent/40 hover:shadow-md",
        plan.isPopular && "mt-4",
      )}
    >
      {/* Popular ribbon — top-end corner, direction-aware */}
      {plan.isPopular && (
        <div
          className={cn(
            "bg-accent text-accent-foreground absolute top-5 z-10 w-28 py-1 text-center text-[10px] font-bold tracking-wide uppercase shadow-md",
            isRTL ? "-left-6 -rotate-45" : "-right-6 rotate-45",
          )}
        >
          {t("onboarding.subscription.popular")}
        </div>
      )}

      {/* Selected indicator — start corner, direction-aware */}
      {isSelected && (
        <div
          className={cn(
            "bg-accent absolute top-2 right-1/2 flex h-6 w-6 translate-x-1/2 items-center justify-center rounded-full",
            isRTL ? "left-4" : "right-4",
          )}
        >
          <Check className="text-accent-foreground h-3.5 w-3.5" />
        </div>
      )}

      {/* Plan name + price */}
      <div className={cn("mb-4", plan.isPopular && "mt-3")}>
        <h3 className="text-foreground text-lg font-bold">{planName}</h3>
        <p className="text-muted mt-1 line-clamp-2 text-sm">
          {planDescription}
        </p>
      </div>

      <div className="mb-5 flex items-baseline gap-1">
        <span className="text-accent text-3xl font-bold">
          ${plan.monthlyFee}
        </span>
        <span className="text-muted text-sm">
          /{t("onboarding.subscription.perMonth")}
        </span>
      </div>

      {/* Divider */}
      <div className="border-border mb-4 border-t" />

      {/* Features */}
      <div className="space-y-2.5">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="bg-success/15 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
              <Check className="text-success h-2.5 w-2.5" />
            </div>
            <span className="text-foreground text-sm">{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
