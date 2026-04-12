import { apiClient } from "@/core/api";

export interface BranchPhoneDto {
  phoneNumber: string;
  label?: string;
}

export interface BranchDto {
  id: string;
  name: string;
  addressLine?: string;
  cityNameEn?: string;
  cityNameAr?: string;
  stateNameEn?: string;
  stateNameAr?: string;
  isMainBranch: boolean;
  isActive: boolean;
  phoneNumbers: BranchPhoneDto[];
}

export interface CreateBranchRequest {
  name: string;
  addressLine: string;
  cityNameEn?: string;
  cityNameAr?: string;
  stateNameEn?: string;
  stateNameAr?: string;
  phoneNumbers: string[];
}

export const branchesApi = {
  async getAll(): Promise<BranchDto[]> {
    const res = await apiClient.get<BranchDto[]>("/branches");
    return res.data;
  },
  async create(data: CreateBranchRequest): Promise<string> {
    const res = await apiClient.post<string>("/branches", data);
    return res.data;
  },
  async update(id: string, data: CreateBranchRequest): Promise<void> {
    await apiClient.put(`/branches/${id}`, data);
  },
  async setActiveStatus(id: string, isActive: boolean): Promise<void> {
    await apiClient.patch(`/branches/${id}/active-status`, { id, isActive });
  },
};
