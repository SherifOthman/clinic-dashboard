import { useBaseTableState } from "@/core/hooks/useTableState";
import type { PatientsSearchParams } from "./types";

export function usePatientsTableState() {
  const { baseState, searchParams, updateParams, buildFilterParams } = useBaseTableState();

  const patientsState: PatientsSearchParams = {
    ...baseState,
    gender:           (searchParams.get("gender") as "Male" | "Female" | null) || undefined,
    countryGeonameId: searchParams.get("countryGeonameId") ? parseInt(searchParams.get("countryGeonameId")!) : undefined,
    stateGeonameId:   searchParams.get("stateGeonameId")   ? parseInt(searchParams.get("stateGeonameId")!)   : undefined,
    cityGeonameId:    searchParams.get("cityGeonameId")    ? parseInt(searchParams.get("cityGeonameId")!)    : undefined,
    clinicSearch:     searchParams.get("clinicId") ?? undefined,
  };

  const updatePatientsState = (updates: Partial<PatientsSearchParams & { gender?: string | null }>) => {
    const params = buildFilterParams(updates);

    if ("searchTerm" in updates)      { params.search = updates.searchTerm; params.page = 1; }
    if ("gender" in updates)          { params.gender = updates.gender; params.page = 1; }
    if ("countryGeonameId" in updates){ params.countryGeonameId = updates.countryGeonameId ?? null; params.page = 1; }
    if ("stateGeonameId" in updates)  { params.stateGeonameId   = updates.stateGeonameId   ?? null; params.page = 1; }
    if ("cityGeonameId" in updates)   { params.cityGeonameId    = updates.cityGeonameId    ?? null; params.page = 1; }
    if ("clinicSearch" in updates)    { params.clinicId = updates.clinicSearch; params.page = 1; }

    updateParams(params, {
      replace: "searchTerm" in updates || "clinicSearch" in updates,
    });
  };

  return { patientsState, updatePatientsState };
}
