import { LocationSelector } from "@/core/components/LocationSelector";
import { setServerErrors } from "@/core/utils/setServerErrors";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { ArrowLeft, CheckCircle, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { OnboardingFormData } from "../schemas";
import { PhoneNumbersInput } from "./PhoneNumbersInput";

interface BranchDetailsStepProps {
  onBack: () => void;
  isLoading: boolean;
  error: any;
}

export function BranchDetailsStep({
  onBack,
  isLoading,
  error,
}: BranchDetailsStepProps) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
    setError,
  } = useFormContext<OnboardingFormData>();

  useEffect(() => {
    if (error) {
      setServerErrors(error, setError, t);
    }
  }, [error, setError, t]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0 bg-content1/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-secondary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {t("onboarding.branchDetails.title")}
              </h2>
              <p className="text-sm text-default-600">
                {t("onboarding.branchDetails.subtitle")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6 space-y-6">
          <Input
            {...register("branchName")}
            label={t("onboarding.clinicInfo.branchName")}
            placeholder={t("onboarding.branchNamePlaceholder")}
            variant="bordered"
            size="lg"
            isInvalid={!!errors.branchName}
            errorMessage={errors.branchName?.message}
            isRequired
          />

          <Input
            {...register("branchAddress")}
            label={t("onboarding.clinicInfo.address")}
            placeholder={t("onboarding.addressPlaceholder")}
            variant="bordered"
            size="lg"
            isInvalid={!!errors.branchAddress}
            errorMessage={errors.branchAddress?.message}
            isRequired
          />

          <PhoneNumbersInput
            control={control}
            watch={watch}
            setValue={setValue}
          />

          <LocationSelector
            onLocationChange={(location) => setValue("location", location)}
            isRequired
          />
        </CardBody>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <Button
          type="button"
          variant="flat"
          size="lg"
          onPress={onBack}
          startContent={<ArrowLeft className="w-5 h-5" />}
        >
          {t("common.back")}
        </Button>
        <Button
          type="submit"
          color="primary"
          size="lg"
          isLoading={isLoading}
          endContent={!isLoading && <CheckCircle className="w-5 h-5" />}
        >
          {isLoading
            ? t("onboarding.settingUp")
            : t("onboarding.completeSetup")}
        </Button>
      </div>
    </div>
  );
}
