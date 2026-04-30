import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import { buildQuery } from "@/core/utils/buildQuery";
import type { AuditLogsResponse, AuditSearchParams } from "./types";

export const auditApi = {
  restorePatient: (patientId: string): Promise<void> =>
    apiClient.patch(`${API_ENDPOINTS.patients}/${patientId}/restore`),

  getLogs: (params: AuditSearchParams = {}): Promise<AuditLogsResponse> =>
    apiClient.get<AuditLogsResponse>(
      `${API_ENDPOINTS.audit}${buildQuery(params as Record<string, unknown>)}`,
    ),
};
