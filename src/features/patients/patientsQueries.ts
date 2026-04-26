import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { patientsApi } from "./patientsApi";
import type { PatientsSearchParams } from "./types";

// ── Shared helper ─────────────────────────────────────────────────────────────

function pickName(lang: string, nameEn: string, nameAr: string) {
  return lang === "ar" ? nameAr : nameEn;
}

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

export function usePatientCountryOptions(enabled = false) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "countries"],
    queryFn: () => patientsApi.getLocationOptions(),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
  const data = raw.map((r) => ({ geonameId: r.geonameId, name: pickName(lang, r.nameEn, r.nameAr) }));
  return { data, ...rest };
}

export function usePatientStateOptions(countryGeonameId: number | undefined) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "states", countryGeonameId],
    queryFn: () => patientsApi.getLocationOptions(countryGeonameId),
    enabled: !!countryGeonameId,
    staleTime: 2 * 60 * 1000,
  });
  const data = raw.map((r) => ({ geonameId: r.geonameId, name: pickName(lang, r.nameEn, r.nameAr) }));
  return { data, ...rest };
}

export function usePatientCityOptions(stateGeonameId: number | undefined) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["patients", "locationOptions", "cities", stateGeonameId],
    queryFn: () => patientsApi.getLocationOptions(undefined, stateGeonameId),
    enabled: !!stateGeonameId,
    staleTime: 2 * 60 * 1000,
  });
  const data = raw.map((r) => ({ geonameId: r.geonameId, name: pickName(lang, r.nameEn, r.nameAr) }));
  return { data, ...rest };
}
