import { apiClient, apiFetch } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import { buildQuery } from "@/core/utils/buildQuery";
import type { PagedResult } from "@/core/types";
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

export interface DoctorVisitTypeDto {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface UpsertDoctorVisitTypeRequest {
  branchId: string;
  visitTypeId?: string | null;
  name: string;
  price: number;
  isActive: boolean;
}

export const staffApi = {
  getStaffList: (params: StaffSearchParams = {}): Promise<PagedResult<StaffDto>> => {
    const { role, isActive, sortBy, sortDirection, pageNumber = 1, pageSize = 10 } = params;
    const q = buildQuery({ pageNumber, pageSize, role, isActive, sortBy, sortDirection });
    return apiClient.get<PagedResult<StaffDto>>(`${API_ENDPOINTS.staff}${q}`);
  },

  getInvitations: (params: InvitationsSearchParams = {}): Promise<PagedResult<InvitationDto>> => {
    const { status, role, sortBy, sortDirection, pageNumber = 1, pageSize = 10 } = params;
    const q = buildQuery({ pageNumber, pageSize, status, role, sortBy, sortDirection });
    return apiClient.get<PagedResult<InvitationDto>>(`${API_ENDPOINTS.staff}/invitations${q}`);
  },

  inviteStaff: (data: InviteStaffRequest): Promise<InviteStaffResponse> =>
    apiClient.post<InviteStaffResponse>(`${API_ENDPOINTS.staff}/invite`, data),

  // Public endpoint — no auth cookie needed
  acceptInvitationWithRegistration: (token: string, data: AcceptInvitationWithRegistration): Promise<void> =>
    apiFetch(`${API_ENDPOINTS.staff}/invitations/${token}/accept-with-registration`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  cancelInvitation: (id: string): Promise<void> =>
    apiClient.delete(`${API_ENDPOINTS.staff}/invitations/${id}`),

  resendInvitation: (id: string): Promise<void> =>
    apiClient.patch(`${API_ENDPOINTS.staff}/invitations/${id}/resend`),

  setOwnerAsDoctor: (data: SetOwnerAsDoctorRequest): Promise<void> =>
    apiClient.patch(`${API_ENDPOINTS.staff}/me/doctor-profile`, data),

  setActiveStatus: (id: string, isActive: boolean): Promise<void> =>
    apiClient.patch(`${API_ENDPOINTS.staff}/${id}/active-status`, { isActive }),

  getStaffDetail: (id: string): Promise<StaffDetailDto> =>
    apiClient.get<StaffDetailDto>(`${API_ENDPOINTS.staff}/${id}`),

  getInvitationDetail: (id: string): Promise<InvitationDetailDto> =>
    apiClient.get<InvitationDetailDto>(`${API_ENDPOINTS.staff}/invitations/${id}`),

  getWorkingDays: (staffId: string, branchId?: string): Promise<WorkingDayDto[]> => {
    const q = branchId ? `?branchId=${branchId}` : "";
    return apiClient.get<WorkingDayDto[]>(`${API_ENDPOINTS.staff}/${staffId}/working-days${q}`);
  },

  saveWorkingDays: (staffId: string, branchId: string, days: WorkingDayInput[]): Promise<void> =>
    apiClient.put(`${API_ENDPOINTS.staff}/${staffId}/working-days`, { branchId, staffId, days }),

  getVisitTypes: (staffId: string, branchId: string): Promise<DoctorVisitTypeDto[]> =>
    apiClient.get<DoctorVisitTypeDto[]>(`${API_ENDPOINTS.staff}/${staffId}/visit-types?branchId=${branchId}`),

  upsertVisitType: (staffId: string, data: UpsertDoctorVisitTypeRequest): Promise<string> =>
    apiClient.put<string>(`${API_ENDPOINTS.staff}/${staffId}/visit-types`, data),

  removeVisitType: (staffId: string, visitTypeId: string): Promise<void> =>
    apiClient.delete(`${API_ENDPOINTS.staff}/${staffId}/visit-types/${visitTypeId}`),

  setScheduleLock: (staffId: string, canSelfManage: boolean): Promise<void> =>
    apiClient.patch(`${API_ENDPOINTS.staff}/${staffId}/schedule-lock`, { canSelfManage }),

  getPermissions: (staffId: string): Promise<string[]> =>
    apiClient.get<string[]>(`${API_ENDPOINTS.staff}/${staffId}/permissions`),

  setPermissions: (staffId: string, permissions: string[]): Promise<void> =>
    apiClient.put(`${API_ENDPOINTS.staff}/${staffId}/permissions`, permissions),
};
