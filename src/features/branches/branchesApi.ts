import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";

const BASE = API_ENDPOINTS.branches;

export interface BranchPhoneDto {
  phoneNumber: string;
  label?: string;
}

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

export interface CreateBranchRequest {
  name: string;
  addressLine: string;
  stateGeonameId?: number;
  cityGeonameId?: number;
  phoneNumbers: string[];
}

export const branchesApi = {
  async getAll(): Promise<BranchDto[]> {
    const res = await apiClient.get<BranchDto[]>(BASE);
    return res.data;
  },
  async create(data: CreateBranchRequest): Promise<string> {
    const res = await apiClient.post<string>(BASE, data);
    return res.data;
  },
  async update(id: string, data: CreateBranchRequest): Promise<void> {
    await apiClient.put(`${BASE}/${id}`, data);
  },
  async setActiveStatus(id: string, isActive: boolean): Promise<void> {
    await apiClient.patch(`${BASE}/${id}/active-status`, { id, isActive });
  },
};
