import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import { buildQuery } from "@/core/utils/buildQuery";
import type { AuditLogsResponse, AuditSearchParams } from "./types";

export async function restorePatient(patientId: string): Promise<void> {
  await apiClient.patch(`${API_ENDPOINTS.patients}/${patientId}/restore`);
}

export async function getAuditLogs(params: AuditSearchParams = {}): Promise<AuditLogsResponse> {
  const res = await apiClient.get<AuditLogsResponse>(
    `${API_ENDPOINTS.audit}${buildQuery(params as Record<string, unknown>)}`,
  );
  return res.data;
}

export async function getMyClinicAuditLogs(params: AuditSearchParams = {}): Promise<AuditLogsResponse> {
  const res = await apiClient.get<AuditLogsResponse>(
    `${API_ENDPOINTS.audit}/my-clinic${buildQuery(params as Record<string, unknown>)}`,
  );
  return res.data;
}
