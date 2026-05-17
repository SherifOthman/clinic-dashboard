import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  getAdminPatientDetail,
  getAdminPatients,
  getChronicDiseases,
  getLocationOptions,
  getPatientDetail,
  getPatients,
} from "./patientsApi";
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
    queryFn:  () => getPatients(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePatientDetail(id: string | null) {
  return useQuery({
    queryKey: ["patients", "detail", id],
    queryFn:  () => getPatientDetail(id!),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminPaginatedPatients(params: PatientsSearchParams = {}) {
  return useQuery({
    queryKey: ["admin", "patients", "paginated", params],
    queryFn:  () => getAdminPatients(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminPatientDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "patients", "detail", id],
    queryFn:  () => getAdminPatientDetail(id!),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChronicDiseases() {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ["chronicDiseases", i18n.language],
    queryFn:  () => getChronicDiseases(i18n.language),
  });
}

export function usePatientCountryOptions(enabled = true) {
  const lang = useLanguage() === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "countries"],
    queryFn:  () => getLocationOptions(),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
  return { data: raw.map(o => ({ ...o, name: lang === "ar" ? o.nameAr : o.nameEn })), ...rest };
}

export function usePatientStateOptions(countryGeonameId: number | undefined) {
  const lang = useLanguage() === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "states", countryGeonameId],
    queryFn:  () => getLocationOptions(countryGeonameId),
    enabled:  !!countryGeonameId,
    staleTime: 2 * 60 * 1000,
  });
  return { data: raw.map(o => ({ ...o, name: lang === "ar" ? o.nameAr : o.nameEn })), ...rest };
}

export function usePatientCityOptions(stateGeonameId: number | undefined) {
  const lang = useLanguage() === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "cities", stateGeonameId],
    queryFn:  () => getLocationOptions(undefined, stateGeonameId),
    enabled:  !!stateGeonameId,
    staleTime: 2 * 60 * 1000,
  });
  return { data: raw.map(o => ({ ...o, name: lang === "ar" ? o.nameAr : o.nameEn })), ...rest };
}
