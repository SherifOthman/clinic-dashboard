import { Button } from "@heroui/react";
import { ArrowLeft, ArrowRight, Building2, CreditCard } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/core/components/form/index";
import { ErrorMessage } from "@/core/components/ui/index";
import type { CompleteOnboarding } from "../schemas";
import type { SubscriptionPlan } from "../types";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";

interface ClinicInfoStepProps {
  plans: SubscriptionPlan[];
  onNext: () => void;
}

export function ClinicInfoStep({ plans, onNext }: ClinicInfoStepProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext<CompleteOnboarding>();

  const selectedPlanId = watch("subscriptionPlanId");
  const clinicName = watch("clinicName");

  const handleNext = async () => {
    const isValid = await trigger(["clinicName", "subscriptionPlanId"]);
    if (isValid) onNext();
  };

  return (
    <div className="space-y-6">
      {/* Clinic name card */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Building2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{t("onboarding.clinicInfo.title")}</h2>
            <p className="text-sm text-muted">{t("onboarding.clinicInfo.subtitle")}</p>
          </div>
        </div>
        <FormInput
          {...register("clinicName")}
          label={t("onboarding.clinicInfo.clinicName")}
          error={errors.clinicName}
          placeholder={t("onboarding.clinicNamePlaceholder")}
          isRequired
        />
      </div>

      {/* Subscription plan card */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
            <CreditCard className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{t("onboarding.subscription.title")}</h2>
            <p className="text-sm text-muted">{t("onboarding.subscription.subtitle")}</p>
          </div>
        </div>

        {errors.subscriptionPlanId && (
          <div className="mb-4">
            <ErrorMessage message={errors.subscriptionPlanId.message} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              onSelect={(planId) => setValue("subscriptionPlanId", planId, { shouldValidate: true })}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          isDisabled={!selectedPlanId || !clinicName}
          onPress={handleNext}
        >
          {t("onboarding.continueToBranchSetup")}
          {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
