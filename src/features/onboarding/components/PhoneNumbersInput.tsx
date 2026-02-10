import { PhoneNumbersInput as CorePhoneNumbersInput } from "@/core/components/PhoneNumbersInput";
import {
  type Control,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { OnboardingFormData } from "../schemas";

interface PhoneNumbersInputProps {
  control: Control<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  setValue: UseFormSetValue<OnboardingFormData>;
}

export function PhoneNumbersInput({
  control,
  watch,
  setValue,
}: PhoneNumbersInputProps) {
  const { t } = useTranslation();
  return (
    <CorePhoneNumbersInput
      control={control}
      watch={watch}
      setValue={setValue}
      name="branchPhoneNumbers"
      label={t("onboarding.clinicInfo.phoneNumbers")}
      showLabels={true}
    />
  );
}
