import { Button, Card } from "@heroui/react";
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
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext<CompleteOnboarding>();

  const selectedPlanId = watch("subscriptionPlanId");

  const handleNext = async () => {
    const isValid = await trigger(["clinicName", "subscriptionPlanId"]);
    if (isValid) onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 flex h-10 w-10 items-center justify-center rounded-full">
              <Building2 className="text-primary h-5 w-5" />
            </div>
            <div>
              <Card.Title>{t("onboarding.clinicInfo.title")}</Card.Title>
              <Card.Description>
                {t("onboarding.clinicInfo.subtitle")}
              </Card.Description>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <FormInput
            {...register("clinicName")}
            label={t("onboarding.clinicInfo.clinicName")}
            error={errors.clinicName}
            placeholder={t("onboarding.clinicNamePlaceholder")}
            isRequired
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="bg-success-50 flex h-10 w-10 items-center justify-center rounded-full">
              <CreditCard className="text-success h-5 w-5" />
            </div>
            <div>
              <Card.Title>{t("onboarding.subscription.title")}</Card.Title>
              <Card.Description>
                {t("onboarding.subscription.subtitle")}
              </Card.Description>
            </div>
          </div>
        </Card.Header>
        {errors.subscriptionPlanId && (
          <div className="px-6">
            <ErrorMessage message={errors.subscriptionPlanId.message} />
          </div>
        )}
        <Card.Content>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelect={(planId) =>
                  setValue("subscriptionPlanId", planId, {
                    shouldValidate: true,
                  })
                }
              />
            ))}
          </div>
        </Card.Content>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          isDisabled={!selectedPlanId || !watch("clinicName")}
          onPress={handleNext}
        >
          {t("onboarding.continueToBranchSetup")}
          {i18n.language === "en" ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

