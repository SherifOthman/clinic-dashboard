import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { staffApi } from "./staffApi";
import type { InvitationsSearchParams, StaffSearchParams } from "./types";

export function useStaffList(params: StaffSearchParams = {}) {
  const { role, isActive, sortBy, sortDirection, pageNumber = 1, pageSize = 10 } = params;
  return useQuery({
    queryKey: ["staff", role, isActive, sortBy, sortDirection, pageNumber, pageSize],
    queryFn: () => staffApi.getStaffList(params),
    placeholderData: keepPreviousData,
  });
}

export function useStaffDetail(id: string | null) {
  return useQuery({
    queryKey: ["staff", "detail", id],
    queryFn: () => staffApi.getStaffDetail(id!),
    enabled: !!id,
  });
}

export function useInvitations(params: InvitationsSearchParams = {}) {
  const { status, role, sortBy, sortDirection, pageNumber = 1, pageSize = 10 } = params;
  return useQuery({
    queryKey: ["staff-invitations", status, role, sortBy, sortDirection, pageNumber, pageSize],
    queryFn: () => staffApi.getInvitations(params),
    placeholderData: keepPreviousData,
  });
}

export function useInvitationDetail(id: string | null) {
  return useQuery({
    queryKey: ["staff-invitations", "detail", id],
    queryFn: () => staffApi.getInvitationDetail(id!),
    enabled: !!id,
  });
}

export function useWorkingDays(staffId: string | null, branchId?: string) {
  return useQuery({
    queryKey: ["staff", "working-days", staffId, branchId],
    queryFn: () => staffApi.getWorkingDays(staffId!, branchId),
    enabled: !!staffId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVisitTypes(staffId: string | null, branchId: string | null) {
  return useQuery({
    queryKey: ["staff", "visit-types", staffId, branchId],
    queryFn: () => staffApi.getVisitTypes(staffId!, branchId!),
    enabled: !!staffId && !!branchId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetPermissions(staffId: string | undefined) {
  return useQuery({
    queryKey: ["staff", "permissions", staffId],
    queryFn: () => staffApi.getPermissions(staffId!),
    enabled: !!staffId,
    staleTime: 5 * 60 * 1000,
  });
}
