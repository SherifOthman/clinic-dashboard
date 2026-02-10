import type { ChronicDiseaseDto } from "@/core/types/api";
import { Button } from "@heroui/button";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useChronicDiseases } from "../hooks/useChronicDiseases";
import type {
  CreatePatientFormData,
  UpdatePatientFormData,
} from "../schemas/patientSchemas";

interface PatientChronicDiseasesProps {
  watch: UseFormWatch<CreatePatientFormData | UpdatePatientFormData>;
  setValue: UseFormSetValue<CreatePatientFormData | UpdatePatientFormData>;
  errors: FieldErrors<CreatePatientFormData | UpdatePatientFormData>;
}

export function PatientChronicDiseases({
  watch,
  setValue,
  errors,
}: PatientChronicDiseasesProps) {
  const { t } = useTranslation();
  const [showDiseases, setShowDiseases] = useState(false);
  const { data: chronicDiseases, isLoading } = useChronicDiseases();
  const chronicDiseaseIds = watch("chronicDiseaseIds");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-foreground">
            Chronic Diseases
          </h4>
          <div className="h-8 w-24 bg-default-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-foreground">
          Chronic Diseases
        </h4>
        <Button
          type="button"
          size="sm"
          variant="flat"
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => setShowDiseases(!showDiseases)}
        >
          {showDiseases
            ? t("patients.hideDiseases")
            : t("patients.addDiseases")}
        </Button>
      </div>

      {showDiseases && (
        <>
          <Divider />
          <div className="space-y-3">
            <p className="text-sm text-default-600">
              Select any chronic diseases that apply to this patient:
            </p>

            <CheckboxGroup
              value={chronicDiseaseIds?.map(String) || []}
              onValueChange={(values) => {
                const numericValues = values
                  .map(Number)
                  .filter((n) => !isNaN(n));
                setValue("chronicDiseaseIds", numericValues as any);
              }}
              classNames={{
                wrapper: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2",
              }}
            >
              {(chronicDiseases || []).map((disease: ChronicDiseaseDto) => (
                <Checkbox
                  key={disease.id}
                  value={disease.id.toString()}
                  classNames={{
                    base: "max-w-full",
                    label: "text-sm",
                  }}
                >
                  {disease.name}
                </Checkbox>
              ))}
            </CheckboxGroup>

            {errors.chronicDiseaseIds && (
              <p className="text-sm text-danger">
                {errors.chronicDiseaseIds.message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
