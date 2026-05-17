import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getCities, getCountries, getStates } from "./api";

const STALE_24H = 24 * 60 * 60 * 1000;

function useLang(): "en" | "ar" {
  const { i18n } = useTranslation();
  return i18n.language === "ar" ? "ar" : "en";
}

export function useCountries() {
  const lang = useLang();
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["location", "countries"],
    queryFn: getCountries,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  const data = raw
    .map((c) => ({ geonameId: c.geonameId, name: lang === "ar" ? c.nameAr : c.nameEn, countryCode: c.countryCode }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { data, ...rest };
}

export function useStates(countryGeonameId: number | null) {
  const lang = useLang();
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["location", "states", countryGeonameId],
    queryFn: () => getStates(countryGeonameId!),
    enabled: !!countryGeonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const data = raw
    .map((s) => ({ geonameId: s.geonameId, name: lang === "ar" ? s.nameAr : s.nameEn }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { data, ...rest };
}

export function useCities(stateGeonameId: number | null) {
  const lang = useLang();
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["location", "cities", stateGeonameId],
    queryFn: () => getCities(stateGeonameId!),
    enabled: !!stateGeonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const data = raw
    .map((c) => ({ geonameId: c.geonameId, name: lang === "ar" ? c.nameAr : c.nameEn }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { data, ...rest };
}

// Resolves a GeoNames ID to a display name using already-cached location data
export function useGeonameLabel(
  geonameId: number | null | undefined,
  type: "country" | "state" | "city",
  parentId?: number | null,
): string | null {
  const lang = useLang();

  const { data: countries = [] } = useQuery({
    queryKey: ["location", "countries"],
    queryFn: getCountries,
    enabled: type === "country" && !!geonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  const { data: states = [] } = useQuery({
    queryKey: ["location", "states", parentId ?? null],
    queryFn: () => getStates(parentId!),
    enabled: type === "state" && !!geonameId && !!parentId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["location", "cities", parentId ?? null],
    queryFn: () => getCities(parentId!),
    enabled: type === "city" && !!geonameId && !!parentId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  if (!geonameId) return null;

  const pick = (nameEn: string, nameAr: string) => (lang === "ar" ? nameAr : nameEn);

  if (type === "country") {
    const c = countries.find((x) => x.geonameId === geonameId);
    return c ? pick(c.nameEn, c.nameAr) : null;
  }
  if (type === "state") {
    const s = states.find((x) => x.geonameId === geonameId);
    return s ? pick(s.nameEn, s.nameAr) : null;
  }
  const c = cities.find((x) => x.geonameId === geonameId);
  return c ? pick(c.nameEn, c.nameAr) : null;
}
