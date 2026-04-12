import {
  Button,
  Card,
  FieldError,
  Label,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { ArrowLeft, CheckCircle, Hospital } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormSelect } from "@/core/components/form";
import { cn } from "@/core/utils";
import { getLocalizedValue } from "@/core/utils/i18nUtils";
import { useSpecializations } from "../onboardingHooks";
import type { CompleteOnboarding } from "../schemas";

interface MedicalServicesStepProps {
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function MedicalServicesStep({
  onNext,
  onBack,
  isLoading,
}: MedicalServicesStepProps) {
  const { t, i18n } = useTranslation();
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CompleteOnboarding>();
  const { data: specializations = [], isLoading: isLoadingSpecializations } =
    useSpecializations();

  const provideMedicalServices = watch("provideMedicalServices");
  const isRTL = i18n.language === "ar";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 flex h-10 w-10 items-center justify-center rounded-full">
              <Hospital className="text-primary h-5 w-5" />
            </div>
            <div>
              <Card.Title>{t("onboarding.medicalServices.title")}</Card.Title>
              <Card.Description>
                {t("onboarding.medicalServices.subtitle")}
              </Card.Description>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div>
            <Label className="mb-3 block text-base font-medium">
              {t("onboarding.medicalServices.question")}
            </Label>
            <RadioGroup
              value={provideMedicalServices || ""}
              onChange={(value) =>
                setValue("provideMedicalServices", value as "yes" | "no", {
                  shouldValidate: true,
                })
              }
              isRequired
              isInvalid={!!errors.provideMedicalServices}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {(["yes", "no"] as const).map((val) => (
                <Radio
                  key={val}
                  value={val}
                  className={cn(
                    "cursor-pointer rounded-lg border-2 p-4 transition-all",
                    "hover:border-primary/50 hover:shadow-sm",
                    "data-[selected=true]:border-primary data-[selected=true]:bg-primary/10",
                    "data-[selected=true]:ring-primary/20 data-[selected=true]:shadow-md data-[selected=true]:ring-2",
                  )}
                >
                  <Radio.Control>
                    <Radio.Indicator className="bg-white" />
                  </Radio.Control>
                  <Radio.Content>
                    <span className="text-base font-medium">
                      {t(`onboarding.medicalServices.${val}`)}
                    </span>
                  </Radio.Content>
                </Radio>
              ))}
            </RadioGroup>
            {errors.provideMedicalServices?.message && (
              <FieldError>{errors.provideMedicalServices.message}</FieldError>
            )}
          </div>

          {provideMedicalServices === "yes" && (
            <div className="bg-default-50 mt-4 rounded-lg p-4">
              <FormSelect
                name="specializationId"
                control={control}
                label={t("onboarding.medicalServices.specialization")}
                options={specializations.map((spec) => ({
                  value: spec.id,
                  label:
                    getLocalizedValue(isRTL, spec.nameAr, spec.nameEn) ??
                    spec.nameEn,
                }))}
                isRequired
                isDisabled={isLoadingSpecializations}
                placeholder={
                  isLoadingSpecializations
                    ? t("common.loading")
                    : t("common.select")
                }
              />
            </div>
          )}
        </Card.Content>
      </Card>

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="outline" size="lg" onPress={onBack}>
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          isDisabled={provideMedicalServices === undefined || isLoading}
          isPending={isLoading}
          onPress={onNext}
        >
          {isLoading
            ? t("onboarding.settingUp")
            : t("onboarding.completeSetup")}
          {!isLoading && <CheckCircle className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
