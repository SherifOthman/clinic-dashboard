import { useBaseTableState } from "@/core/hooks/useTableState";
import { useSearchParams } from "react-router-dom";
import type { PatientsSearchParams } from "../types/patient";

export function usePatientsTableState() {
  const { baseState, updateBaseState, setSearchParams } = useBaseTableState();
  const [searchParams] = useSearchParams();

  const patientsState: PatientsSearchParams = (() => {
    const genderParam = searchParams.get("gender");
    const gender = genderParam !== null ? parseInt(genderParam) : undefined;

    return {
      ...baseState,
      gender,
    };
  })();

  const updatePatientsState = (updates: Partial<PatientsSearchParams>) => {
    const baseUpdates: any = {};
    if ("pageNumber" in updates) baseUpdates.pageNumber = updates.pageNumber;
    if ("pageSize" in updates) baseUpdates.pageSize = updates.pageSize;
    if ("searchTerm" in updates) baseUpdates.searchTerm = updates.searchTerm;
    if ("sortBy" in updates) baseUpdates.sortBy = updates.sortBy;
    if ("sortDirection" in updates)
      baseUpdates.sortDirection = updates.sortDirection;

    if (Object.keys(baseUpdates).length > 0) {
      updateBaseState(baseUpdates);
    }

    if ("gender" in updates) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);

        if (updates.gender !== undefined && updates.gender !== null) {
          newParams.set("gender", updates.gender.toString());
        } else {
          newParams.delete("gender");
        }

        newParams.set("page", "1");
        return newParams;
      });
    }
  };

  return {
    patientsState,
    updatePatientsState,
  };
}
