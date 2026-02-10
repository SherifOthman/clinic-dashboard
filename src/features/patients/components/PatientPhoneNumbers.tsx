import { PhoneNumbersInput } from "@/core/components/PhoneNumbersInput";
import {
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import type {
  CreatePatientFormData,
  UpdatePatientFormData,
} from "../schemas/patientSchemas";

interface PatientPhoneNumbersProps {
  control: any; // Still need control for useFieldArray
  watch: UseFormWatch<CreatePatientFormData | UpdatePatientFormData>;
  setValue: UseFormSetValue<CreatePatientFormData | UpdatePatientFormData>;
  errors: FieldErrors<CreatePatientFormData | UpdatePatientFormData>;
}

export function PatientPhoneNumbers({
  control,
  watch,
  setValue,
  errors,
}: PatientPhoneNumbersProps) {
  const { t } = useTranslation();
  return (
    <PhoneNumbersInput
      control={control}
      watch={watch}
      setValue={setValue}
      name="phoneNumbers"
      label={t("patients.phoneNumbers")}
      errors={errors.phoneNumbers}
    />
  );
}
