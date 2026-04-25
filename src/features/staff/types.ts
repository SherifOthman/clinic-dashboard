import type { BaseSearchParams } from "@/core/types";

// List DTO — flat, minimal joins
export interface StaffDto {
  id: string;
  fullName: string;
  gender: string;
  joinDate: string;
  profileImageUrl?: string;
  isActive: boolean;
  roles: StaffRoleDto[];
}

// Detail DTO — full info loaded on row click
export interface StaffDetailDto {
  id: string;
  fullName: string;
  gender: string;
  email?: string;
  phoneNumber?: string;
  joinDate: string;
  profileImageUrl?: string;
  isActive: boolean;
  roles: StaffRoleDto[];
  doctorProfile?: DoctorDetailDto;
}

export interface StaffRoleDto {
  name: string;
}

export interface DoctorDetailDto {
  doctorProfileId: string;
  specializationNameEn: string;
  specializationNameAr: string;
  canSelfManageSchedule: boolean;
}

// List DTO — minimal joins
export interface InvitationDto {
  id: string;
  email: string;
  role: string;
  specializationNameEn?: string;
  specializationNameAr?: string;
  status: InvitationStatus;
  invitedAt: string;
  expiresAt: string;
  invitedBy: string;
}

// Detail DTO — full info loaded on row click
export interface InvitationDetailDto {
  id: string;
  email: string;
  role: string;
  specializationNameEn?: string;
  specializationNameAr?: string;
  status: InvitationStatus;
  invitedAt: string;
  expiresAt: string;
  invitedBy: string;
  acceptedAt?: string;
  acceptedBy?: string;
}

export enum InvitationStatus {
  Pending = 0,
  Accepted = 1,
  Canceled = 2,
  Expired = 3,
}

export interface InviteStaffRequest {
  role: string;
  email: string;
  specializationId?: string;
}

export interface InviteStaffResponse {
  invitationId: string;
}

export interface AcceptInvitationWithRegistration {
  fullName: string;
  userName: string;
  password: string;
  phoneNumber: string;
  gender: string;
}

export interface SetOwnerAsDoctorRequest {
  specializationId?: string;
}

export interface StaffSearchParams extends BaseSearchParams {
  role?: string;
  isActive?: boolean;
}

export interface InvitationsSearchParams extends BaseSearchParams {
  status?: InvitationStatus;
  role?: string;
}
