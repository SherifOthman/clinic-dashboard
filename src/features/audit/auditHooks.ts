import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { auditApi } from "./auditApi";
import type { AuditSearchParams } from "./types";

export function useAuditLogs(params: AuditSearchParams) {
  return useQuery({
    queryKey: ["audit", params],
    queryFn: () => auditApi.getLogs(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useRestorePatient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId: string) => auditApi.restorePatient(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit"] });
      onSuccess?.();
    },
  });
}
