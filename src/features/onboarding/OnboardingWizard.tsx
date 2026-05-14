import { useValidation } from "@/core/hooks/useValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/core/components/ui/ErrorMessage";
import { Loading } from "@/core/components/ui/Loading";

import { BranchDetailsStep } from "./components/BranchDetailsStep";
import { ClinicInfoStep } from "./components/ClinicInfoStep";
import { useCompleteOnboarding, useSubscriptionPlans } from "./onboardingHooks";
import { type CompleteOnboarding, createOnboardingSchemas } from "./schemas";

export default function OnboardingWizard() {
  const { t } = useTranslation();
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const schemas = useValidation(createOnboardingSchemas);
  const completeOnboarding = useCompleteOnboarding();
  const [showBranch, setShowBranch] = useState(false);

  const methods = useForm<CompleteOnboarding>({
    resolver: zodResolver(schemas.completeOnboarding),
    mode: "onChange",
  });

  if (isLoading) return <Loading className="h-screen" />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <img src="/logo.svg" alt="ClinicCare" className="h-8 w-8" />
          <span className="text-xl font-bold">ClinicCare</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t("onboarding.title")}</h1>
        <p className="mt-2 text-sm text-muted sm:text-base">{t("onboarding.subtitle")}</p>
      </div>

      <FormProvider {...methods}>
        {showBranch ? (
          <BranchDetailsStep
            onNext={methods.handleSubmit((data) => completeOnboarding.mutate(data))}
            onBack={() => setShowBranch(false)}
            isLoading={completeOnboarding.isPending}
          />
        ) : (
          <ClinicInfoStep plans={plans || []} onNext={() => setShowBranch(true)} />
        )}
      </FormProvider>
    </div>
  );
}