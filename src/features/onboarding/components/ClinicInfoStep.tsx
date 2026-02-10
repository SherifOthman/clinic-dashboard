import type { SubscriptionPlanDto } from "@/core/types/api";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { ArrowRight, Building2, CreditCard, Star, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { OnboardingFormData } from "../schemas";

interface ClinicInfoStepProps {
  plans: SubscriptionPlanDto[];
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
  } = useFormContext<OnboardingFormData>();

  const selectedPlanId = watch("subscriptionPlanId");
  const [selectedPlan, setSelectedPlan] = useState<string>(
    selectedPlanId || "",
  );

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setValue("subscriptionPlanId", planId, { shouldValidate: true });
  };

  const handleNext = async () => {
    // Validate only step 1 fields
    const isValid = await trigger(["clinicName", "subscriptionPlanId"]);
    if (isValid) {
      onNext();
    }
  };

  const getPlanName = (plan: SubscriptionPlanDto) => {
    return i18n.language === "ar" && plan.nameAr ? plan.nameAr : plan.name;
  };

  const getPlanDescription = (plan: SubscriptionPlanDto) => {
    return i18n.language === "ar" && plan.descriptionAr
      ? plan.descriptionAr
      : plan.description;
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0 bg-content1/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {t("onboarding.clinicInfo.title")}
              </h2>
              <p className="text-sm text-default-600">
                {t("onboarding.clinicInfo.subtitle")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <Input
            {...register("clinicName")}
            label={t("onboarding.clinicInfo.clinicName")}
            placeholder={t("onboarding.clinicNamePlaceholder")}
            variant="bordered"
            size="lg"
            startContent={<Building2 className="w-4 h-4 text-gray-400" />}
            isInvalid={!!errors.clinicName}
            errorMessage={errors.clinicName?.message}
            isRequired
          />
        </CardBody>
      </Card>

      <Card className="shadow-lg border-0 bg-content1/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-success" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {t("onboarding.subscription.title")}
              </h2>
              <p className="text-sm text-default-600">
                {t("onboarding.subscription.subtitle")}
              </p>
            </div>
          </div>
          {errors.subscriptionPlanId && (
            <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-sm text-danger flex items-center">
                <X className="w-4 h-4 mr-2" />
                {errors.subscriptionPlanId.message}
              </p>
            </div>
          )}
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-primary shadow-xl bg-primary/5 border-primary"
                    : "border-2 hover:shadow-lg"
                }`}
                isPressable
                onPress={() => handlePlanSelect(plan.id)}
              >
                <CardBody className="p-6 text-center space-y-4">
                  {plan.isPopular && (
                    <div className="absolute rtl:top-4 ltr:top-5 rotate-45 -right-6 bg-primary text-white text-xs px-5 py-1">
                      {t("onboarding.subscription.popular")}
                    </div>
                  )}
                  <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {getPlanName(plan)}
                    </h3>
                    <div className="text-2xl font-bold text-primary">
                      ${plan.monthlyFee}
                      <span className="text-sm font-normal">
                        /{t("onboarding.subscription.perMonth")}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-default-600 mb-4">
                    {getPlanDescription(plan)}
                  </p>

                  <div
                    className={`space-y-2 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="text-xs text-default-500">
                      <div>
                        •{" "}
                        {plan.maxBranches === -1
                          ? t("common.unlimited")
                          : plan.maxBranches}{" "}
                        {t("onboarding.subscription.features.branches")}
                      </div>
                      <div>
                        •{" "}
                        {plan.maxStaff === -1
                          ? t("common.unlimited")
                          : plan.maxStaff}{" "}
                        {t("onboarding.subscription.features.staff")}
                      </div>
                      {plan.hasAdvancedReporting && (
                        <div>
                          •{" "}
                          {t(
                            "onboarding.subscription.features.advancedReporting",
                          )}
                        </div>
                      )}
                      {plan.hasApiAccess && (
                        <div>
                          • {t("onboarding.subscription.features.apiAccess")}
                        </div>
                      )}
                      {plan.hasPrioritySupport && (
                        <div>
                          •{" "}
                          {t(
                            "onboarding.subscription.features.prioritySupport",
                          )}
                        </div>
                      )}
                      {plan.hasCustomBranding && (
                        <div>
                          •{" "}
                          {t("onboarding.subscription.features.customBranding")}
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end pt-6">
        <Button
          type="button"
          color="primary"
          size="lg"
          isDisabled={!selectedPlan}
          onPress={handleNext}
          endContent={<ArrowRight className="w-5 h-5" />}
        >
          {t("onboarding.continueToBranchSetup")}
        </Button>
      </div>
    </div>
  );
}
