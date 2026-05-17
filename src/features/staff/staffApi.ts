import { apiClient } from "@/core/api";
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
  name: string;
  price: number;
  isActive: boolean;
}

export async function getStaffList(params: StaffSearchParams = {}): Promise<PagedResult<StaffDto>> {
  const { role, isActive, sortBy, sortDirection, pageNumber = 1, pageSize = 10 } = params;
  const q = buildQuery({ pageNumber, pageSize, role, isActive, sortBy, sortDirection });
  const res = await apiClient.get<PagedResult<StaffDto>>(`${API_ENDPOINTS.staff}${q}`);
  return res.data;
}

export async function getInvitations(params: InvitationsSearchParams = {}): Promise<PagedResult<InvitationDto>> {
  const { status, role, sortBy, sortDirection, pageNumber = 1, pageSize = 10 } = params;
  const q = buildQuery({ pageNumber, pageSize, status, role, sortBy, sortDirection });
  const res = await apiClient.get<PagedResult<InvitationDto>>(`${API_ENDPOINTS.staff}/invitations${q}`);
  return res.data;
}

export async function inviteStaff(data: InviteStaffRequest): Promise<InviteStaffResponse> {
  const res = await apiClient.post<InviteStaffResponse>(`${API_ENDPOINTS.staff}/invite`, data);
  return res.data;
}

export async function acceptInvitationWithRegistration(token: string, data: AcceptInvitationWithRegistration): Promise<void> {
  await apiClient.post(`${API_ENDPOINTS.staff}/invitations/${token}/accept-with-registration`, data);
}

export async function cancelInvitation(id: string): Promise<void> {
  await apiClient.patch(`${API_ENDPOINTS.staff}/invitations/${id}/cancel`);
}

export async function resendInvitation(id: string): Promise<void> {
  await apiClient.patch(`${API_ENDPOINTS.staff}/invitations/${id}/resend`);
}

export async function setOwnerAsDoctor(data: SetOwnerAsDoctorRequest): Promise<void> {
  await apiClient.patch(`${API_ENDPOINTS.staff}/me/doctor-profile`, data);
}

export async function setStaffActiveStatus(id: string, isActive: boolean): Promise<void> {
  await apiClient.patch(`${API_ENDPOINTS.staff}/${id}/active-status`, { isActive });
}

export async function getStaffDetail(id: string): Promise<StaffDetailDto> {
  const res = await apiClient.get<StaffDetailDto>(`${API_ENDPOINTS.staff}/${id}`);
  return res.data;
}

export async function getInvitationDetail(id: string): Promise<InvitationDetailDto> {
  const res = await apiClient.get<InvitationDetailDto>(`${API_ENDPOINTS.staff}/invitations/${id}`);
  return res.data;
}

export async function getWorkingDays(staffId: string, branchId?: string): Promise<WorkingDayDto[]> {
  const q = branchId ? `?branchId=${branchId}` : "";
  const res = await apiClient.get<WorkingDayDto[]>(`${API_ENDPOINTS.staff}/${staffId}/working-days${q}`);
  return res.data;
}

export async function saveWorkingDays(staffId: string, branchId: string, days: WorkingDayInput[]): Promise<void> {
  await apiClient.put(`${API_ENDPOINTS.staff}/${staffId}/working-days`, { branchId, staffId, days });
}

export async function getVisitTypes(staffId: string, branchId: string): Promise<DoctorVisitTypeDto[]> {
  const res = await apiClient.get<DoctorVisitTypeDto[]>(`${API_ENDPOINTS.staff}/${staffId}/visit-types?branchId=${branchId}`);
  return res.data;
}

export async function createVisitType(staffId: string, data: UpsertDoctorVisitTypeRequest): Promise<string> {
  const res = await apiClient.post<string>(`${API_ENDPOINTS.staff}/${staffId}/visit-types`, data);
  return res.data;
}

export async function updateVisitType(staffId: string, visitTypeId: string, data: UpsertDoctorVisitTypeRequest): Promise<void> {
  await apiClient.put(`${API_ENDPOINTS.staff}/${staffId}/visit-types/${visitTypeId}`, data);
}

export async function removeVisitType(staffId: string, visitTypeId: string): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.staff}/${staffId}/visit-types/${visitTypeId}`);
}

export async function setScheduleLock(staffId: string, canSelfManage: boolean): Promise<void> {
  await apiClient.patch(`${API_ENDPOINTS.staff}/${staffId}/schedule-lock`, { canSelfManage });
}

export async function getPermissions(staffId: string): Promise<string[]> {
  const res = await apiClient.get<string[]>(`${API_ENDPOINTS.staff}/${staffId}/permissions`);
  return res.data;
}

export async function setPermissions(staffId: string, permissions: string[]): Promise<void> {
  await apiClient.put(`${API_ENDPOINTS.staff}/${staffId}/permissions`, permissions);
}
