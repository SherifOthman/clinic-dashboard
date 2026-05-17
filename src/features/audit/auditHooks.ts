import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAuditLogs, getMyClinicAuditLogs, restorePatient } from "./auditApi";
import type { AuditSearchParams } from "./types";

export function useAuditLogs(params: AuditSearchParams) {
  return useQuery({
    queryKey: ["audit", "superadmin", params],
    queryFn: () => getAuditLogs(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useMyClinicAuditLogs(params: AuditSearchParams) {
  return useQuery({
    queryKey: ["audit", "my-clinic", params],
    queryFn: () => getMyClinicAuditLogs(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useRestorePatient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId: string) => restorePatient(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit"] });
      onSuccess?.();
    },
  });
}
