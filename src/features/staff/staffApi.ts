import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { PagedResult } from "@/core/types";
import axios from "axios";
import type {
  AcceptInvitationWithRegistration,
  InvitationDetailDto,
  InvitationDto,
  InvitationsSearchParams,
  InviteStaffRequest,
  InviteStaffResponse,
  SetOwnerAsDoctorRequest,
  StaffDetailDto,
  StaffDto,
  StaffSearchParams,
} from "./types";

export interface WorkingDayDto {
  day: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  branchId: string;
}

export interface WorkingDayInput {
  day: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Public client for unauthenticated endpoints
const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

export const staffApi = {
  getStaffList: async (
    params: StaffSearchParams = {},
  ): Promise<PagedResult<StaffDto>> => {
    const {
      role,
      isActive,
      sortBy,
      sortDirection,
      pageNumber = 1,
      pageSize = 10,
    } = params;
    const p: Record<string, any> = { pageNumber, pageSize };
    if (role) p.role = role;
    if (isActive !== undefined) p.isActive = isActive;
    if (sortBy) p.sortBy = sortBy;
    if (sortDirection) p.sortDirection = sortDirection;
    const response = await apiClient.get<PagedResult<StaffDto>>(
      API_ENDPOINTS.staff,
      {
        params: p,
      },
    );
    return response.data;
  },

  getInvitations: async (
    params: InvitationsSearchParams = {},
  ): Promise<PagedResult<InvitationDto>> => {
    const {
      status,
      role,
      sortBy,
      sortDirection,
      pageNumber = 1,
      pageSize = 10,
    } = params;
    const p: Record<string, any> = { pageNumber, pageSize };
    if (status !== undefined) p.status = status;
    if (role) p.role = role;
    if (sortBy) p.sortBy = sortBy;
    if (sortDirection) p.sortDirection = sortDirection;
    const response = await apiClient.get<PagedResult<InvitationDto>>(
      `${API_ENDPOINTS.staff}/invitations`,
      { params: p },
    );
    return response.data;
  },

  inviteStaff: async (
    data: InviteStaffRequest,
  ): Promise<InviteStaffResponse> => {
    const response = await apiClient.post<InviteStaffResponse>(
      `${API_ENDPOINTS.staff}/invite`,
      data,
    );
    return response.data;
  },

  acceptInvitationWithRegistration: async (
    token: string,
    data: AcceptInvitationWithRegistration,
  ): Promise<void> => {
    await publicClient.post(
      `${API_ENDPOINTS.staff}/invitations/${token}/accept-with-registration`,
      data,
    );
  },

  cancelInvitation: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.staff}/invitations/${id}`);
  },

  resendInvitation: async (id: string): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.staff}/invitations/${id}/resend`);
  },

  setOwnerAsDoctor: async (data: SetOwnerAsDoctorRequest): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.staff}/set-owner-as-doctor`, data);
  },

  setActiveStatus: async (id: string, isActive: boolean): Promise<void> => {
    await apiClient.patch(`${API_ENDPOINTS.staff}/${id}/active-status`, {
      isActive,
    });
  },

  getStaffDetail: async (id: string): Promise<StaffDetailDto> => {
    const response = await apiClient.get<StaffDetailDto>(
      `${API_ENDPOINTS.staff}/${id}`,
    );
    return response.data;
  },

  getInvitationDetail: async (id: string): Promise<InvitationDetailDto> => {
    const response = await apiClient.get<InvitationDetailDto>(
      `${API_ENDPOINTS.staff}/invitations/${id}`,
    );
    return response.data;
  },

  getWorkingDays: async (
    staffId: string,
    branchId?: string,
  ): Promise<WorkingDayDto[]> => {
    const params = branchId ? { branchId } : {};
    const res = await apiClient.get<WorkingDayDto[]>(
      `${API_ENDPOINTS.staff}/${staffId}/working-days`,
      { params },
    );
    return res.data;
  },

  saveWorkingDays: async (
    staffId: string,
    branchId: string,
    days: WorkingDayInput[],
  ): Promise<void> => {
    await apiClient.put(`${API_ENDPOINTS.staff}/${staffId}/working-days`, {
      branchId,
      staffId,
      days,
    });
  },
};
