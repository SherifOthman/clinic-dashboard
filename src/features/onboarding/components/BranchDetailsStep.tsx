import { Button, Card } from "@heroui/react";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/core/components/form/index";
import { LocationSelector } from "@/core/components/form/LocationSelector";
import type { CompleteOnboarding } from "../schemas";

interface BranchDetailsStepProps {
  onBack: () => void;
  onNext: () => void;
}

export function BranchDetailsStep({ onBack, onNext }: BranchDetailsStepProps) {
  const { t, i18n } = useTranslation();
  const form = useFormContext<CompleteOnboarding>();
  const {
    register,
    formState: { errors },
    trigger,
  } = form;

  const handleNext = async () => {
    const isValid = await trigger(["branchName", "addressLine"]);
    if (isValid) onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="bg-secondary-50 flex h-10 w-10 items-center justify-center rounded-full">
              <MapPin className="text-secondary h-5 w-5" />
            </div>
            <div>
              <Card.Title>{t("onboarding.branchDetails.title")}</Card.Title>
              <Card.Description>
                {t("onboarding.branchDetails.subtitle")}
              </Card.Description>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="space-y-4">
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
        </Card.Content>
      </Card>

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="outline" size="lg" onPress={onBack}>
          {i18n.language === "en" ? (
            <ArrowLeft className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {t("common.back")}
        </Button>
        <Button type="button" variant="primary" size="lg" onPress={handleNext}>
          {t("common.continue")}
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
