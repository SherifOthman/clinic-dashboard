import { NameFields } from "@/core/components/NameFields";
import { calculateDetailedAge, formatDetailedAge } from "@/core/utils/ageUtils";
import { DatePicker } from "@heroui/date-picker";
import { Input } from "@heroui/input";
import { Radio, RadioGroup } from "@heroui/radio";
import { parseDate } from "@internationalized/date";
import {
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import type {
  CreatePatientFormData,
  UpdatePatientFormData,
} from "../schemas/patientSchemas";

interface PatientBasicInfoProps {
  register: UseFormRegister<CreatePatientFormData | UpdatePatientFormData>;
  watch: UseFormWatch<CreatePatientFormData | UpdatePatientFormData>;
  setValue: UseFormSetValue<CreatePatientFormData | UpdatePatientFormData>;
  errors: FieldErrors<CreatePatientFormData | UpdatePatientFormData>;
  onAgeChange: (age: number) => void;
  onDateOfBirthChange: (dateOfBirth: string) => void;
}

export function PatientBasicInfo({
  register,
  watch,
  setValue,
  errors,
  onAgeChange,
  onDateOfBirthChange,
}: PatientBasicInfoProps) {
  const { t } = useTranslation();
  const dateOfBirth = watch("dateOfBirth");
  const age = watch("age");
  const gender = watch("gender");

  return (
    <div className="space-y-4">
      <NameFields register={register} errors={errors} isUserForm={false} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <DatePicker
            label={t("patients.dateOfBirth")}
            variant="bordered"
            value={dateOfBirth ? parseDate(dateOfBirth.split("T")[0]) : null}
            onChange={(date) => {
              const dateString = date ? date.toString() : "";
              setValue("dateOfBirth", dateString);
              onDateOfBirthChange(dateString);
            }}
            showMonthAndYearPickers
            isInvalid={!!errors.dateOfBirth}
            errorMessage={errors.dateOfBirth?.message}
          />

          {dateOfBirth && (
            <div className="text-sm text-default-600 mt-1">
              {formatDetailedAge(calculateDetailedAge(dateOfBirth))}
            </div>
          )}
        </div>

        <Input
          value={age?.toString() || ""}
          label={t("patients.age")}
          placeholder={t("patients.enterAge")}
          type="number"
          min={0}
          max={150}
          variant="bordered"
          isInvalid={!!errors.age}
          errorMessage={errors.age?.message}
          onChange={(e) => {
            const value = e.target.value;
            setValue("age", value ? parseInt(value) : undefined);
            const ageNum = parseInt(value);
            if (!isNaN(ageNum)) {
              onAgeChange(ageNum);
            }
          }}
        />

        <RadioGroup
          label={t("patients.gender")}
          orientation="horizontal"
          value={gender || ""}
          onValueChange={(value) =>
            setValue("gender", value as "Male" | "Female")
          }
          isInvalid={!!errors.gender}
          errorMessage={errors.gender?.message}
        >
          <Radio value="Male">Male</Radio>
          <Radio value="Female">Female</Radio>
        </RadioGroup>
      </div>
    </div>
  );
}
