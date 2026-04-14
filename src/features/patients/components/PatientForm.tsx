import { FormSection } from "@/core/components/form/FormSection";
import { LocationSelector } from "@/core/components/form/LocationSelector";
import { PhoneNumbersInput } from "@/core/components/form/PhoneNumbersInput";
import { Button } from "@heroui/react";
import { MapPin, Phone, User } from "lucide-react";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { usePatientForm } from "../patientsHooks";
import type { PatientFormData } from "../schemas";
import type { PatientDetail } from "../types";
import { PatientBasicInfo } from "./PatientBasicInfo";
import { PatientChronicDiseases } from "./PatientChronicDiseases";

interface PatientFormProps {
  patient?: PatientDetail;
  draft?: Partial<PatientFormData>;
  onDraftChange?: (values: Partial<PatientFormData>) => void;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  showReset?: boolean;
  onReset?: () => void;
}

export function PatientForm({
  patient,
  draft,
  onDraftChange,
  onSubmit,
  onCancel,
  isLoading,
  showReset = false,
  onReset,
}: PatientFormProps) {
  const { t } = useTranslation();
  const { form, isEditing, resetCount, handleFormSubmit, resetForm } =
    usePatientForm({
      patient,
      draft,
      onSubmit,
    });

  // Sync form values back to parent as draft whenever they change
  useEffect(() => {
    if (!onDraftChange) return;
    const subscription = form.watch((values) => {
      onDraftChange(values as Partial<PatientFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form, onDraftChange]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="flex flex-col gap-4">
          {/* ── Personal Info ── */}
          <FormSection
            icon={<User className="h-4 w-4" />}
            title={t("patients.personalInfo")}
          >
            <PatientBasicInfo resetCount={resetCount} />
          </FormSection>

          {/* ── Contact & Location ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <FormSection
                icon={<Phone className="h-4 w-4" />}
                title={t("patients.contactInfo")}
              >
                <PhoneNumbersInput form={form} name="phoneNumbers" />
              </FormSection>

              <PatientChronicDiseases />
            </div>

            <FormSection
              icon={<MapPin className="h-4 w-4" />}
              title={t("common.fields.address")}
            >
              <LocationSelector
                form={form}
                countryGeonameIdField="countryGeonameId"
                stateGeonameIdField="stateGeonameId"
                cityGeonameIdField="cityGeonameId"
              />
            </FormSection>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="border-divider mt-5 flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="ghost" onPress={onCancel}>
            {t("common.cancel")}
          </Button>
          {showReset && (
            <Button
              type="button"
              variant="ghost"
              onPress={() => {
                resetForm();
                onReset?.();
              }}
              className="text-muted"
            >
              {t("common.reset")}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isDisabled={isLoading}
            isPending={isLoading}
          >
            {isLoading
              ? isEditing
                ? t("common.update") + "..."
                : t("common.creating")
              : isEditing
                ? t("patients.updatePatient")
                : t("patients.createPatient")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
