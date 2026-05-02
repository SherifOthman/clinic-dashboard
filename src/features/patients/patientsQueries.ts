import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { patientsApi } from "./patientsApi";
import type { PatientsSearchParams } from "./types";

// ── Shared helper ─────────────────────────────────────────────────────────────

function useLanguage() {
  const { i18n } = useTranslation();
  return i18n.language;
}

// ── Clinic-scoped hooks ───────────────────────────────────────────────────────

export function usePaginatedPatients(params: PatientsSearchParams = {}) {
  return useQuery({
    queryKey: ["patients", "paginated", params],
    queryFn:  () => patientsApi.getPaginated(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePatientDetail(id: string | null) {
  return useQuery({
    queryKey: ["patients", "detail", id],
    queryFn:  () => patientsApi.getDetail(id!),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Admin (cross-tenant) hooks ────────────────────────────────────────────────

export function useAdminPaginatedPatients(params: PatientsSearchParams = {}) {
  return useQuery({
    queryKey: ["admin", "patients", "paginated", params],
    queryFn:  () => patientsApi.getAdminPaginated(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminPatientDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "patients", "detail", id],
    queryFn:  () => patientsApi.getAdminDetail(id!),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Reference data ────────────────────────────────────────────────────────────

export function useChronicDiseases() {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ["chronicDiseases", i18n.language],
    queryFn:  () => patientsApi.getChronicDiseases(i18n.language),
  });
}

export function usePatientCountryOptions(enabled = true) {
  const lang = useLanguage() === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "countries"],
    queryFn:  () => patientsApi.getLocationOptions(),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
  return { data: raw.map(o => ({ ...o, name: lang === "ar" ? o.nameAr : o.nameEn })), ...rest };
}

export function usePatientStateOptions(countryGeonameId: number | undefined) {
  const lang = useLanguage() === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "states", countryGeonameId],
    queryFn:  () => patientsApi.getLocationOptions(countryGeonameId),
    enabled:  !!countryGeonameId,
    staleTime: 2 * 60 * 1000,
  });
  return { data: raw.map(o => ({ ...o, name: lang === "ar" ? o.nameAr : o.nameEn })), ...rest };
}

export function usePatientCityOptions(stateGeonameId: number | undefined) {
  const lang = useLanguage() === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "cities", stateGeonameId],
    queryFn:  () => patientsApi.getLocationOptions(undefined, stateGeonameId),
    enabled:  !!stateGeonameId,
    staleTime: 2 * 60 * 1000,
  });
  return { data: raw.map(o => ({ ...o, name: lang === "ar" ? o.nameAr : o.nameEn })), ...rest };
}
