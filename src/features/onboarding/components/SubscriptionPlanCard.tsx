import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/utils";
import type { SubscriptionPlan } from "../types";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

export function SubscriptionPlanCard({ plan, isSelected, onSelect }: SubscriptionPlanCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const planName = isRTL && plan.nameAr ? plan.nameAr : plan.name;
  const planDescription = isRTL && plan.descriptionAr ? plan.descriptionAr : plan.description;

  const features = [
    { text: `${plan.maxBranches === -1 ? t("common.unlimited") : plan.maxBranches} ${t("onboarding.subscription.features.branches")}` },
    { text: `${plan.maxStaff === -1 ? t("common.unlimited") : plan.maxStaff} ${t("onboarding.subscription.features.staff")}` },
    ...(plan.hasAdvancedReporting ? [{ text: t("onboarding.subscription.features.advancedReporting") }] : []),
    ...(plan.hasApiAccess ? [{ text: t("onboarding.subscription.features.apiAccess") }] : []),
    ...(plan.hasPrioritySupport ? [{ text: t("onboarding.subscription.features.prioritySupport") }] : []),
    ...(plan.hasCustomBranding ? [{ text: t("onboarding.subscription.features.customBranding") }] : []),
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(plan.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(plan.id)}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-6 transition-all duration-200",
        isSelected
          ? "border-accent bg-accent/5 shadow-lg ring-2 ring-accent/20"
          : "border-border bg-surface hover:border-accent/40 hover:shadow-md",
        plan.isPopular && "mt-4",
      )}
    >
      {/* Popular ribbon — top-end corner, direction-aware */}
      {plan.isPopular && (
        <div className={cn(
          "absolute top-5 z-10 w-28 bg-accent py-1 text-center text-[10px] font-bold uppercase tracking-wide text-accent-foreground shadow-md",
          isRTL
            ? "-left-6 -rotate-45"
            : "-right-6 rotate-45",
        )}>
          {t("onboarding.subscription.popular")}
        </div>
      )}

      {/* Selected indicator — start corner, direction-aware */}
      {isSelected && (
        <div className={cn(
          "absolute top-4 flex h-6 w-6 items-center justify-center rounded-full bg-accent",
          isRTL ? "left-4" : "right-4",
        )}>
          <Check className="h-3.5 w-3.5 text-accent-foreground" />
        </div>
      )}

      {/* Plan name + price */}
      <div className={cn("mb-4", plan.isPopular && "mt-3")}>
        <h3 className="text-lg font-bold text-foreground">{planName}</h3>
        <p className="mt-1 text-sm text-muted line-clamp-2">{planDescription}</p>
      </div>

      <div className="mb-5 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-accent">${plan.monthlyFee}</span>
        <span className="text-sm text-muted">/{t("onboarding.subscription.perMonth")}</span>
      </div>

      {/* Divider */}
      <div className="mb-4 border-t border-border" />

      {/* Features */}
      <div className="space-y-2.5">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15">
              <Check className="h-2.5 w-2.5 text-success" />
            </div>
            <span className="text-sm text-foreground">{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
