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

// ── Location filter options (from actual patient data) ────────────────────────

/** Countries that have at least one patient in this clinic. Lazy — fetches on first open. */
export function usePatientCountryOptions(enabled = false) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "countries"],
    queryFn: () => patientsApi.getLocationOptions(),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
  const data = raw.map((r) => ({
    geonameId: r.geonameId,
    name: lang === "ar" ? r.nameAr : r.nameEn,
  }));
  return { data, ...rest };
}

/** States in a country that have at least one patient. Fetches when countryGeonameId is set. */
export function usePatientStateOptions(countryGeonameId: number | undefined) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "states", countryGeonameId],
    queryFn: () => patientsApi.getLocationOptions(countryGeonameId),
    enabled: !!countryGeonameId,
    staleTime: 2 * 60 * 1000,
  });
  const data = raw.map((r) => ({
    geonameId: r.geonameId,
    name: lang === "ar" ? r.nameAr : r.nameEn,
  }));
  return { data, ...rest };
}

/** Cities in a state that have at least one patient. Fetches when stateGeonameId is set. */
export function usePatientCityOptions(stateGeonameId: number | undefined) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "cities", stateGeonameId],
    queryFn: () => patientsApi.getLocationOptions(undefined, stateGeonameId),
    enabled: !!stateGeonameId,
    staleTime: 2 * 60 * 1000,
  });
  const data = raw.map((r) => ({
    geonameId: r.geonameId,
    name: lang === "ar" ? r.nameAr : r.nameEn,
  }));
  return { data, ...rest };
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
    countryGeonameId: data.countryGeonameId ?? undefined,
    stateGeonameId: data.stateGeonameId ?? undefined,
    cityGeonameId: data.cityGeonameId ?? undefined,
    phoneNumbers: data.phoneNumbers.filter((p) => p.trim() !== ""),
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
    countryGeonameId: null,
    stateGeonameId: null,
    cityGeonameId: null,
    phoneNumbers: [],
    chronicDiseaseIds: [],
  };

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
    handleFormSubmit: onSubmit,
    resetForm: () => !patient && form.reset(defaults),
  };
}

// ── Table State ───────────────────────────────────────────────────────────────

export function usePatientsTableState() {
  const { baseState, searchParams, updateParams } = useBaseTableState();

  const rawState = searchParams.get("stateGeonameId");
  const rawCity = searchParams.get("cityGeonameId");
  const rawCountry = searchParams.get("countryGeonameId");

  const patientsState: PatientsSearchParams = {
    ...baseState,
    gender:
      (searchParams.get("gender") as "Male" | "Female" | null) || undefined,
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

    if ("searchTerm" in updates) {
      params.search = updates.searchTerm;
      params.page = 1;
    }

    if ("sortBy" in updates) params.sortBy = updates.sortBy;
    if ("sortDirection" in updates) {
      params.sortDirection =
        updates.sortDirection === "asc" ? null : updates.sortDirection;
    }

    if ("gender" in updates) params.gender = updates.gender;
    if ("stateGeonameId" in updates)
      params.stateGeonameId = updates.stateGeonameId ?? null;
    if ("cityGeonameId" in updates)
      params.cityGeonameId = updates.cityGeonameId ?? null;
    if ("countryGeonameId" in updates)
      params.countryGeonameId = updates.countryGeonameId ?? null;
    if ("clinicSearch" in updates) params.clinicId = updates.clinicSearch;

    if (
      "gender" in updates ||
      "stateGeonameId" in updates ||
      "cityGeonameId" in updates ||
      "countryGeonameId" in updates ||
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
