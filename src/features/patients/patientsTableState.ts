import { useBaseTableState } from "@/core/hooks/useTableState";
import type { PatientsSearchParams } from "./types";

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
