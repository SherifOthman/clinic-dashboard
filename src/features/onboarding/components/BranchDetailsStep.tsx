import { Button } from "@heroui/react";
import { ArrowLeft, ArrowRight, CheckCircle, MapPin, Phone } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/core/components/form/index";
import { LocationSelector } from "@/core/components/form/LocationSelector";
import { PhoneNumbersInput } from "@/core/components/form/PhoneNumbersInput";
import type { CompleteOnboarding } from "../schemas";

interface BranchDetailsStepProps {
  onBack: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

export function BranchDetailsStep({ onBack, onNext, isLoading = false }: BranchDetailsStepProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const form = useFormContext<CompleteOnboarding>();
  const { register, formState: { errors }, trigger } = form;

  const handleNext = async () => {
    const isValid = await trigger(["branchName", "addressLine"]);
    if (isValid) onNext();
  };

  return (
    <div className="space-y-6">
      {/* Branch info card */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{t("onboarding.branchDetails.title")}</h2>
            <p className="text-sm text-muted">{t("onboarding.branchDetails.subtitle")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <FormInput
            {...register("branchName")}
            label={t("onboarding.clinicInfo.branchName")}
            error={errors.branchName}
            placeholder={t("onboarding.branchNamePlaceholder")}
            isRequired
          />
          <FormInput
            {...register("addressLine")}
            label={t("onboarding.clinicInfo.address")}
            error={errors.addressLine}
            placeholder={t("onboarding.addressPlaceholder")}
            isRequired
          />
          <LocationSelector
            form={form}
            stateGeonameIdField="stateGeonameId"
            cityGeonameIdField="cityGeonameId"
            onCountryCodeChange={(code) => form.setValue("countryCode", code)}
          />
        </div>
      </div>

      {/* Phone numbers card */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
            <Phone className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{t("onboarding.clinicInfo.phoneNumbers")}</h2>
            <p className="text-sm text-muted">{t("onboarding.branchDetails.subtitle")}</p>
          </div>
        </div>
        <PhoneNumbersInput form={form} name="phoneNumbers" maxItems={3} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" size="lg" onPress={onBack}>
          {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {t("common.back")}
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          isPending={isLoading}
          isDisabled={isLoading}
          onPress={handleNext}
        >
          {isLoading ? t("onboarding.settingUp") : t("onboarding.completeSetup")}
          {!isLoading && <CheckCircle className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
