import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useBaseTableState } from "@/core/hooks/useTableState";
import { useValidation } from "@/core/hooks/useValidation";
import { calculateAge } from "../../core/utils/ageUtils";
import { patientsApi } from "./patientsApi";
import { createPatientSchema, type PatientFormData } from "./schemas";
import type {
  PatientApiRequest,
  PatientDetail,
  PatientsSearchParams,
} from "./types";

// ── Queries ───────────────────────────────────────────────────────────────────

export function usePaginatedPatients(
  params: PatientsSearchParams = {},
  isSuperAdmin = false,
) {
  return useQuery({
    queryKey: ["patients", "paginated", params, isSuperAdmin],
    queryFn: () => patientsApi.getPaginated(params, isSuperAdmin),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePatientDetail(id: string | null, isSuperAdmin = false) {
  return useQuery({
    queryKey: ["patients", "detail", id, isSuperAdmin],
    queryFn: () => patientsApi.getDetail(id!, isSuperAdmin),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChronicDiseases() {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ["chronicDiseases", i18n.language],
    queryFn: () => patientsApi.getChronicDiseases(i18n.language),
  });
}

export function usePatientStates(isSuperAdmin = false, enabled = false) {
  return useQuery({
    queryKey: ["patients", "states", isSuperAdmin],
    queryFn: () => patientsApi.getStates(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export function usePatientCities(isSuperAdmin = false, enabled = false) {
  return useQuery({
    queryKey: ["patients", "cities", isSuperAdmin],
    queryFn: () => patientsApi.getCities(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export function usePatientCountries(isSuperAdmin = false, enabled = false) {
  return useQuery({
    queryKey: ["patients", "countries", isSuperAdmin],
    queryFn: () => patientsApi.getCountries(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreatePatient() {
  return useMutationWithToast<string, PatientApiRequest>({
    mutationFn: (patient) => patientsApi.create(patient),
    successMessage: "toast.patientCreatedSuccessfully",
    invalidateKeys: [["patients"]],
  });
}

export function useUpdatePatient() {
  return useMutationWithToast<void, { id: string; patient: PatientApiRequest }>(
    {
      mutationFn: ({ id, patient }) => patientsApi.update(id, patient),
      successMessage: "toast.patientUpdatedSuccessfully",
      invalidateKeys: [["patients"]],
    },
  );
}

export function useDeletePatient() {
  return useMutationWithToast<void, string>({
    mutationFn: (id) => patientsApi.delete(id),
    successMessage: "toast.patientDeletedSuccessfully",
    invalidateKeys: [["patients"]],
  });
}

// ── Form ──────────────────────────────────────────────────────────────────────

/** Maps form data to the flat API request shape. */
export function toPatientApiRequest(data: PatientFormData): PatientApiRequest {
  return {
    fullName: data.fullName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    bloodType: data.bloodType || undefined,
    cityNameEn: data.cityNameEn || undefined,
    cityNameAr: data.cityNameAr || undefined,
    stateNameEn: data.stateNameEn || undefined,
    stateNameAr: data.stateNameAr || undefined,
    countryNameEn: data.countryNameEn || undefined,
    countryNameAr: data.countryNameAr || undefined,
    phoneNumbers: data.phoneNumbers,
    chronicDiseaseIds: data.chronicDiseaseIds ?? [],
  };
}

interface UsePatientFormOptions {
  patient?: PatientDetail;
  draft?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => void;
}

export function usePatientForm({
  patient,
  draft,
  onSubmit,
}: UsePatientFormOptions) {
  const schema = useValidation(createPatientSchema);

  const defaults: PatientFormData = {
    fullName: "",
    dateOfBirth: "",
    age: undefined,
    gender: "Male",
    bloodType: "",
    cityNameEn: null,
    cityNameAr: null,
    stateNameEn: null,
    stateNameAr: null,
    phoneNumbers: [],
    chronicDiseaseIds: [],
  };

  // For create mode: merge draft over defaults so saved values are restored
  const createDefaults: PatientFormData = draft
    ? { ...defaults, ...(draft as PatientFormData) }
    : defaults;

  const form = useForm<PatientFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: patient ? defaults : createDefaults,
    values: patient
      ? {
          fullName: patient.fullName,
          dateOfBirth: patient.dateOfBirth || "",
          age: patient.dateOfBirth
            ? calculateAge(patient.dateOfBirth)
            : undefined,
          gender: patient.gender as "Male" | "Female",
          bloodType: patient.bloodType || "",
          cityNameEn: patient.cityNameEn ?? null,
          cityNameAr: patient.cityNameAr ?? null,
          stateNameEn: patient.stateNameEn ?? null,
          stateNameAr: patient.stateNameAr ?? null,
          phoneNumbers: patient.phoneNumbers,
          chronicDiseaseIds: patient.chronicDiseases.map((d) => d.id),
        }
      : undefined,
  });

  return {
    form,
    isEditing: !!patient,
    handleFormSubmit: onSubmit,
    resetForm: () => !patient && form.reset(defaults),
  };
}

// ── Table State ───────────────────────────────────────────────────────────────

export function usePatientsTableState() {
  const { baseState, searchParams, updateParams } = useBaseTableState();

  const patientsState: PatientsSearchParams = {
    ...baseState,
    gender:
      (searchParams.get("gender") as "Male" | "Female" | null) || undefined,
    stateSearch: searchParams.get("state") ?? undefined,
    citySearch: searchParams.get("city") ?? undefined,
    countrySearch: searchParams.get("country") ?? undefined,
    clinicSearch: searchParams.get("clinicId") ?? undefined,
  };

  const updatePatientsState = (
    updates: Partial<PatientsSearchParams & { gender?: string | null }>,
  ) => {
    const params: Record<string, any> = {};

    // 🔹 Base fields
    if ("pageNumber" in updates) params.page = updates.pageNumber;
    if ("pageSize" in updates) params.size = updates.pageSize;

    if ("searchTerm" in updates) {
      params.search = updates.searchTerm;
      params.page = 1; // reset page
    }

    if ("sortBy" in updates) params.sortBy = updates.sortBy;
    if ("sortDirection" in updates) {
      params.sortDirection =
        updates.sortDirection === "asc" ? null : updates.sortDirection;
    }

    // 🔹 Filters
    if ("gender" in updates) params.gender = updates.gender;
    if ("stateSearch" in updates) params.state = updates.stateSearch;
    if ("citySearch" in updates) params.city = updates.citySearch;
    if ("countrySearch" in updates) params.country = updates.countrySearch;
    if ("clinicSearch" in updates) params.clinicId = updates.clinicSearch;

    if (
      "gender" in updates ||
      "stateSearch" in updates ||
      "citySearch" in updates ||
      "countrySearch" in updates ||
      "clinicSearch" in updates
    ) {
      params.page = 1;
    }

    updateParams(params, {
      replace: "searchTerm" in updates || "clinicSearch" in updates,
    });
  };

  return {
    patientsState,
    updatePatientsState,
  };
}
