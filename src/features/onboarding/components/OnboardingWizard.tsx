import { ErrorMessage } from "@/core/components/ErrorMessage";
import { Loading } from "@/core/components/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCompleteOnboarding } from "../hooks/useOnboardingMutations";
import {
  useCountries,
  useSubscriptionPlans,
} from "../hooks/useOnboardingQueries";
import { onboardingSchema, type OnboardingFormData } from "../schemas";
import { BranchDetailsStep } from "./BranchDetailsStep";
import { ClinicInfoStep } from "./ClinicInfoStep";
import { OnboardingHeader } from "./OnboardingHeader";
import { ProgressIndicator } from "./ProgressIndicator";

const TOTAL_STEPS = 2;

export function OnboardingWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Single form instance for all steps
  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      clinicName: "",
      subscriptionPlanId: "",
      branchName: "",
      branchAddress: "",
      branchPhoneNumbers: [{ phoneNumber: "", label: "" }],
      location: {
        countryGeonameId: 0,
        countryIso2Code: "",
        countryPhoneCode: "",
        countryNameEn: "",
        countryNameAr: "",
        stateGeonameId: 0,
        stateNameEn: "",
        stateNameAr: "",
        cityGeonameId: 0,
        cityNameEn: "",
        cityNameAr: "",
      },
    },
  });

  const {
    data: plans,
    isLoading: plansLoading,
    error: plansError,
  } = useSubscriptionPlans();
  const { isLoading: countriesLoading, error: countriesError } = useCountries();
  const completeOnboarding = useCompleteOnboarding();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (data: OnboardingFormData) => {
    // Filter out empty phone numbers
    const filteredPhoneNumbers = data.branchPhoneNumbers.filter(
      (phone) => phone.phoneNumber && phone.phoneNumber.trim() !== "",
    );

    const submitData = {
      ...data,
      branchPhoneNumbers: filteredPhoneNumbers,
    };

    try {
      await completeOnboarding.mutateAsync(submitData);
      navigate("/onboarding-success");
    } catch (error) {
      console.error("Onboarding failed:", error);
    }
  };

  if (plansLoading || countriesLoading) return <Loading />;
  if (plansError)
    return <ErrorMessage message={t("onboarding.errors.failedToLoadPlans")} />;
  if (countriesError)
    return (
      <ErrorMessage message={t("onboarding.errors.failedToLoadCountries")} />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-100 relative">
      <OnboardingHeader />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <ProgressIndicator currentStep={currentStep} />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Activity mode={currentStep === 1 ? "visible" : "hidden"}>
              <ClinicInfoStep plans={plans || []} onNext={handleNext} />
            </Activity>

            <Activity mode={currentStep === 2 ? "visible" : "hidden"}>
              <BranchDetailsStep
                onBack={handleBack}
                isLoading={completeOnboarding.isPending}
                error={completeOnboarding.error}
              />
            </Activity>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
