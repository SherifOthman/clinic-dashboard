import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { AuditLogsResponse, AuditSearchParams } from "./types";

export const auditApi = {
  async restorePatient(patientId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.patients}/${patientId}/restore`);
  },

  async getLogs(params: AuditSearchParams = {}): Promise<AuditLogsResponse> {
    const p = new URLSearchParams();
    if (params.entityType) p.append("entityType", params.entityType);
    if (params.entityId) p.append("entityId", params.entityId);
    if (params.action) p.append("action", params.action);
    if (params.from) p.append("from", params.from);
    if (params.to) p.append("to", params.to);
    if (params.userSearch) p.append("userSearch", params.userSearch);
    if (params.clinicSearch) p.append("clinicSearch", params.clinicSearch);
    if (params.pageNumber) p.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) p.append("pageSize", params.pageSize.toString());

    const res = await apiClient.get<AuditLogsResponse>(
      `${API_ENDPOINTS.audit}?${p.toString()}`,
    );
    return res.data;
  },
};
