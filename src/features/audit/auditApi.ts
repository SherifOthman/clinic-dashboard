import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import { buildQuery } from "@/core/utils/buildQuery";
import type { AuditLogsResponse, AuditSearchParams } from "./types";

export const auditApi = {
  restorePatient: (patientId: string): Promise<void> =>
    apiClient.patch(`${API_ENDPOINTS.patients}/${patientId}/restore`),

  /** SuperAdmin: all clinics */
  getLogs: (params: AuditSearchParams = {}): Promise<AuditLogsResponse> =>
    apiClient.get<AuditLogsResponse>(
      `${API_ENDPOINTS.audit}${buildQuery(params as Record<string, unknown>)}`,
    ),

  /** Clinic Owner: own clinic only — scoped server-side from JWT */
  getMyClinicLogs: (params: AuditSearchParams = {}): Promise<AuditLogsResponse> =>
    apiClient.get<AuditLogsResponse>(
      `${API_ENDPOINTS.audit}/my-clinic${buildQuery(params as Record<string, unknown>)}`,
    ),
};
