import { useValidation } from "@/core/hooks/useValidation";
import { Card } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/core/components/ui/ErrorMessage";
import { Loading } from "@/core/components/ui/Loading";

import { BranchDetailsStep } from "./components/BranchDetailsStep";
import { ClinicInfoStep } from "./components/ClinicInfoStep";
import { MedicalServicesStep } from "./components/MedicalServicesStep";
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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  const steps = [
    {
      title: "Clinic Info",
      component: (
        <ClinicInfoStep plans={plans || []} onNext={() => setCurrentStep(1)} />
      ),
    },
    {
      title: "Branch Details",
      component: (
        <BranchDetailsStep
          onNext={() => setCurrentStep(2)}
          onBack={() => setCurrentStep(0)}
        />
      ),
    },
    {
      title: "Medical Services",
      component: (
        <MedicalServicesStep
          onNext={methods.handleSubmit(onSubmit)}
          onBack={() => setCurrentStep(1)}
          isLoading={completeOnboarding.isPending}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          {t("onboarding.title")}
        </h1>
        <p className="text-default-500 text-sm">{t("onboarding.subtitle")}</p>
      </div>

      {/* Progress Card */}
      <Card className="mb-6">
        <Card.Content className="p-6">
          <ProgressIndicator currentStep={currentStep} />
        </Card.Content>
      </Card>

      {/* Form */}
      <FormProvider {...methods}>
        <form>{steps[currentStep].component}</form>
      </FormProvider>
    </div>
  );
}
