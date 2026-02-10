import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePatientForm } from "../hooks/usePatientForm";
import type {
  CreatePatientFormData,
  UpdatePatientFormData,
} from "../schemas/patientSchemas";
import type { PatientDto } from "../types/patient";
import { PatientBasicInfo } from "./PatientBasicInfo";
import { PatientChronicDiseases } from "./PatientChronicDiseases";
import { PatientLocationInfo } from "./PatientLocationInfo";
import { PatientPhoneNumbers } from "./PatientPhoneNumbers";

interface PatientFormProps {
  patient?: PatientDto;
  onSubmit: (data: CreatePatientFormData | UpdatePatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: any;
}

export function PatientForm({
  patient,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: PatientFormProps) {
  const { t } = useTranslation();
  const {
    form,
    isEditing,
    handleFormSubmit,
    locationState,
    handleAgeChange,
    handleDateOfBirthChange,
  } = usePatientForm({ patient, onSubmit, error });

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                {isEditing
                  ? t("patients.editPatient")
                  : t("patients.addPatient")}
              </h3>
              <p className="text-sm text-default-600">
                {isEditing
                  ? t("patients.updatePatientInfo")
                  : t("patients.enterPatientDetails")}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          <PatientBasicInfo
            register={form.register}
            watch={form.watch}
            setValue={form.setValue}
            errors={form.formState.errors}
            onAgeChange={handleAgeChange}
            onDateOfBirthChange={handleDateOfBirthChange}
          />

          <PatientLocationInfo
            locationState={locationState}
            patient={patient}
            isEditing={isEditing}
          />

          <PatientPhoneNumbers
            control={form.control}
            watch={form.watch}
            setValue={form.setValue}
            errors={form.formState.errors}
          />

          <PatientChronicDiseases
            watch={form.watch}
            setValue={form.setValue}
            errors={form.formState.errors}
          />
        </CardBody>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button type="submit" color="primary" isLoading={isLoading}>
          {isLoading
            ? isEditing
              ? "Updating..."
              : t("common.creating")
            : isEditing
              ? t("patients.updatePatient")
              : t("patients.createPatient")}
        </Button>
      </div>
    </form>
  );
}
