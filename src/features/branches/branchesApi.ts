import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";

const BASE = API_ENDPOINTS.branches;

export interface BranchPhoneDto { phoneNumber: string; label?: string; }

export interface BranchDto {
  id: string;
  name: string;
  addressLine?: string;
  stateGeonameId?: number;
  cityGeonameId?: number;
  isMainBranch: boolean;
  isActive: boolean;
  phoneNumbers: BranchPhoneDto[];
}

export interface BranchPhoneInput { phoneNumber: string; label?: string; }

export interface CreateBranchRequest {
  name: string;
  addressLine: string;
  stateGeonameId?: number;
  cityGeonameId?: number;
  phoneNumbers: BranchPhoneInput[];
}

export const branchesApi = {
  getAll: (): Promise<BranchDto[]>          => apiClient.get<BranchDto[]>(BASE),
  create: (data: CreateBranchRequest): Promise<string> => apiClient.post<string>(BASE, data),
  update: (id: string, data: CreateBranchRequest): Promise<void> => apiClient.put(`${BASE}/${id}`, data),
  setActiveStatus: (id: string, isActive: boolean): Promise<void> =>
    apiClient.patch(`${BASE}/${id}/active-status`, { id, isActive }),
};
