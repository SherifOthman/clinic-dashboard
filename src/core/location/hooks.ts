import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { locationApi } from "./api";

const STALE = 24 * 60 * 60 * 1000; // 24h

export function useCountries() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  return useQuery({
    queryKey: ["location", "countries", lang],
    queryFn: () => locationApi.getCountries(lang),
    staleTime: STALE,
    gcTime: STALE,
    retry: false,
  });
}

export function useStates(countryGeonameId: number | null) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  return useQuery({
    queryKey: ["location", "states", countryGeonameId, lang],
    queryFn: () => locationApi.getStates(countryGeonameId!, lang),
    enabled: !!countryGeonameId && countryGeonameId > 0,
    staleTime: STALE,
    gcTime: STALE,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

export function useCities(stateGeonameId: number | null) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  return useQuery({
    queryKey: ["location", "cities", stateGeonameId, lang],
    queryFn: () => locationApi.getCities(stateGeonameId!, lang),
    enabled: !!stateGeonameId && stateGeonameId > 0,
    staleTime: STALE,
    gcTime: STALE,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/**
 * Resolves a display name for a GeoNames ID in the current UI language.
 * Uses the cached location lists — no extra network requests if already loaded.
 */
export function useGeonameLabel(
  geonameId: number | null | undefined,
  type: "country" | "state" | "city",
  parentGeonameId?: number | null,
): string | null {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";

  const stateParentId = type === "state" ? (parentGeonameId ?? null) : null;
  const cityParentId = type === "city" ? (parentGeonameId ?? null) : null;

  const { data: countries = [] } = useQuery({
    queryKey: ["location", "countries", lang],
    queryFn: () => locationApi.getCountries(lang),
    staleTime: STALE,
    gcTime: STALE,
    retry: false,
    enabled: type === "country" && !!geonameId,
  });

  const { data: states = [] } = useQuery({
    queryKey: ["location", "states", stateParentId, lang],
    queryFn: () => locationApi.getStates(stateParentId!, lang),
    enabled: type === "state" && !!geonameId && !!stateParentId,
    staleTime: STALE,
    gcTime: STALE,
    retry: false,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["location", "cities", cityParentId, lang],
    queryFn: () => locationApi.getCities(cityParentId!, lang),
    enabled: type === "city" && !!geonameId && !!cityParentId,
    staleTime: STALE,
    gcTime: STALE,
    retry: false,
  });

  if (!geonameId) return null;

  if (type === "country") {
    return countries.find((c) => c.geonameId === geonameId)?.name ?? null;
  }
  if (type === "state") {
    return states.find((s) => s.geonameId === geonameId)?.name ?? null;
  }
  return cities.find((c) => c.geonameId === geonameId)?.name ?? null;
}
