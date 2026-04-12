import { Check, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/core/utils";

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
      show: true,
      text: `${plan.maxBranches === -1 ? t("common.unlimited") : plan.maxBranches} ${t("onboarding.subscription.features.branches")}`,
    },
    {
      show: true,
      text: `${plan.maxStaff === -1 ? t("common.unlimited") : plan.maxStaff} ${t("onboarding.subscription.features.staff")}`,
    },
    {
      show: plan.hasAdvancedReporting,
      text: t("onboarding.subscription.features.advancedReporting"),
    },
    {
      show: plan.hasApiAccess,
      text: t("onboarding.subscription.features.apiAccess"),
    },
    {
      show: plan.hasPrioritySupport,
      text: t("onboarding.subscription.features.prioritySupport"),
    },
    {
      show: plan.hasCustomBranding,
      text: t("onboarding.subscription.features.customBranding"),
    },
  ].filter((f) => f.show);

  return (
    <div
      onClick={() => onSelect(plan.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(plan.id);
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "relative transition-all cursor-pointer rounded-xl p-6",
        isSelected
          ? "border-2 border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
          : "border-2 border-default-200 hover:border-primary/50 bg-background hover:shadow-md",
      )}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
          <Star className="h-3 w-3 fill-current" />
          {t("onboarding.subscription.popular")}
        </div>
      )}

      {/* Header */}
      <div className={cn("text-center", plan.isPopular && "mt-2")}>
        <h3 className="text-xl font-bold mb-2">{planName}</h3>
        <div className="flex items-baseline justify-center gap-1 mb-3">
          <span className="text-3xl font-bold text-primary">
            ${plan.monthlyFee}
          </span>
          <span className="text-sm text-default-500">
            /{t("onboarding.subscription.perMonth")}
          </span>
        </div>
        <p className="text-sm text-default-600 line-clamp-2 min-h-10">
          {planDescription}
        </p>
      </div>

      {/* Features */}
      <div className="mt-6 pt-6 border-t border-default-200">
        <p className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-4">
          {t("onboarding.subscription.features.title")}
        </p>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <span className="text-sm text-default-700">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

