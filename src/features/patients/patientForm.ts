import { useValidation } from "@/core/hooks/useValidation";
import { calculateAge } from "@/core/utils/ageUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { createPatientSchema, type PatientFormData } from "./schemas";
import type { PatientApiRequest, PatientDetail } from "./types";

// ── Form data → API request mapper ───────────────────────────────────────────

export function toPatientApiRequest(data: PatientFormData): PatientApiRequest {
  return {
    fullName: data.fullName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    bloodType: data.bloodType || undefined,
    countryGeonameId: data.countryGeonameId ?? undefined,
    stateGeonameId: data.stateGeonameId ?? undefined,
    cityGeonameId: data.cityGeonameId ?? undefined,
    phoneNumbers: data.phoneNumbers.filter((p) => p.trim() !== ""),
    chronicDiseaseIds: data.chronicDiseaseIds ?? [],
  };
}

// ── Form hook ─────────────────────────────────────────────────────────────────

interface UsePatientFormOptions {
  patient?: PatientDetail;
  draft?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => void;
}

const emptyDefaults: PatientFormData = {
  fullName: "",
  dateOfBirth: "",
  age: undefined,
  gender: "Male",
  bloodType: "",
  countryGeonameId: null,
  stateGeonameId: null,
  cityGeonameId: null,
  phoneNumbers: [],
  chronicDiseaseIds: [],
};

export function usePatientForm({ patient, draft, onSubmit }: UsePatientFormOptions) {
  const schema = useValidation(createPatientSchema);
  const [resetCount, setResetCount] = React.useState(0);

  const createDefaults: PatientFormData = draft
    ? { ...emptyDefaults, ...(draft as PatientFormData) }
    : emptyDefaults;

  const form = useForm<PatientFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: patient ? emptyDefaults : createDefaults,
    values: patient
      ? {
          fullName: patient.fullName,
          dateOfBirth: patient.dateOfBirth || "",
          age: patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : undefined,
          gender: patient.gender as "Male" | "Female",
          bloodType: patient.bloodType || "",
          countryGeonameId: patient.countryGeonameId ?? null,
          stateGeonameId: patient.stateGeonameId ?? null,
          cityGeonameId: patient.cityGeonameId ?? null,
          phoneNumbers: patient.phoneNumbers,
          chronicDiseaseIds: patient.chronicDiseases.map((d) => d.id),
        }
      : undefined,
  });

  return {
    form,
    isEditing: !!patient,
    resetCount,
    handleFormSubmit: onSubmit,
    resetForm: () => {
      if (!patient) {
        form.reset(emptyDefaults);
        setResetCount((c) => c + 1);
      }
    },
  };
}
