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

export async function getBranches(): Promise<BranchDto[]> {
  const res = await apiClient.get<BranchDto[]>(BASE);
  return res.data;
}

export async function createBranch(data: CreateBranchRequest): Promise<string> {
  const res = await apiClient.post<string>(BASE, data);
  return res.data;
}

export async function updateBranch(id: string, data: CreateBranchRequest): Promise<void> {
  await apiClient.put(`${BASE}/${id}`, data);
}

export async function setBranchActiveStatus(id: string, isActive: boolean): Promise<void> {
  await apiClient.patch(`${BASE}/${id}/active-status`, { id, isActive });
}
