import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "../api/patientsApi";
import type { PatientsSearchParams } from "../types/patient";

/**
 * Patient query hooks
 */

export function usePaginatedPatients(params: PatientsSearchParams = {}) {
  return useQuery({
    queryKey: ["patients", "paginated", params],
    queryFn: () => patientsApi.getPaginated(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => patientsApi.getById(id),
    enabled: !!id && id.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
