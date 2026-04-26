import { useBaseTableState } from "@/core/hooks/useTableState";
import { useValidation } from "@/core/hooks/useValidation";
import { calculateAge } from "@/core/utils/ageUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { createPatientSchema, type PatientFormData } from "./schemas";
import type { PatientApiRequest, PatientDetail, PatientsSearchParams } from "./types";

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

// ── Table state ───────────────────────────────────────────────────────────────

export function usePatientsTableState() {
  const { baseState, searchParams, updateParams } = useBaseTableState();

  const rawState = searchParams.get("stateGeonameId");
  const rawCity = searchParams.get("cityGeonameId");
  const rawCountry = searchParams.get("countryGeonameId");

  const patientsState: PatientsSearchParams = {
    ...baseState,
    gender: (searchParams.get("gender") as "Male" | "Female" | null) || undefined,
    stateGeonameId: rawState ? parseInt(rawState) : undefined,
    cityGeonameId: rawCity ? parseInt(rawCity) : undefined,
    countryGeonameId: rawCountry ? parseInt(rawCountry) : undefined,
    clinicSearch: searchParams.get("clinicId") ?? undefined,
  };

  const updatePatientsState = (
    updates: Partial<PatientsSearchParams & { gender?: string | null }>,
  ) => {
    const params: Record<string, any> = {};

    if ("pageNumber" in updates) params.page = updates.pageNumber;
    if ("pageSize" in updates) params.size = updates.pageSize;
    if ("searchTerm" in updates) { params.search = updates.searchTerm; params.page = 1; }
    if ("sortBy" in updates) params.sortBy = updates.sortBy;
    if ("sortDirection" in updates)
      params.sortDirection = updates.sortDirection === "asc" ? null : updates.sortDirection;
    if ("gender" in updates) params.gender = updates.gender;
    if ("stateGeonameId" in updates) params.stateGeonameId = updates.stateGeonameId ?? null;
    if ("cityGeonameId" in updates) params.cityGeonameId = updates.cityGeonameId ?? null;
    if ("countryGeonameId" in updates) params.countryGeonameId = updates.countryGeonameId ?? null;
    if ("clinicSearch" in updates) params.clinicId = updates.clinicSearch;

    if (
      "gender" in updates || "stateGeonameId" in updates ||
      "cityGeonameId" in updates || "countryGeonameId" in updates ||
      "clinicSearch" in updates
    ) params.page = 1;

    updateParams(params, {
      replace: "searchTerm" in updates || "clinicSearch" in updates,
    });
  };

  return { patientsState, updatePatientsState };
}
