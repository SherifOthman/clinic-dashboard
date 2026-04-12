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
