import { useValidation } from "@/core/hooks/useValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/core/components/ui/ErrorMessage";
import { Loading } from "@/core/components/ui/Loading";

import { BranchDetailsStep } from "./components/BranchDetailsStep";
import { ClinicInfoStep } from "./components/ClinicInfoStep";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { useCompleteOnboarding, useSubscriptionPlans } from "./onboardingHooks";
import { type CompleteOnboarding, createOnboardingSchemas } from "./schemas";

export default function OnboardingWizard() {
  const { t } = useTranslation();
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const schemas = useValidation(createOnboardingSchemas);
  const completeOnboarding = useCompleteOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<CompleteOnboarding>({
    resolver: zodResolver(schemas.completeOnboarding),
    mode: "onChange",
  });

  const onSubmit = (data: CompleteOnboarding) => {
    completeOnboarding.mutate(data);
  };

  if (isLoading) return <Loading className="h-screen" />;
  if (error) return <ErrorMessage message={error.message} />;

  const steps = [
    {
      component: (
        <ClinicInfoStep plans={plans || []} onNext={() => setCurrentStep(1)} />
      ),
    },
    {
      component: (
        <BranchDetailsStep
          onNext={methods.handleSubmit(onSubmit)}
          onBack={() => setCurrentStep(0)}
          isLoading={completeOnboarding.isPending}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <img src="/logo.svg" alt="ClinicCare" className="h-8 w-8" />
          <span className="text-xl font-bold">ClinicCare</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t("onboarding.title")}</h1>
        <p className="mt-2 text-sm text-muted sm:text-base">{t("onboarding.subtitle")}</p>
      </div>

      {/* Progress */}
      <ProgressIndicator currentStep={currentStep} totalSteps={2} />

      {/* Step content */}
      <FormProvider {...methods}>
        <form>{steps[currentStep].component}</form>
      </FormProvider>
    </div>
  );
}
