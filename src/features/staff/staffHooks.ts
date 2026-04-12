import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useToast } from "@/core/hooks/useToast";
import { createErrorHandler } from "@/core/utils/apiErrorHandler";
import { staffApi } from "./staffApi";
import type {
  AcceptInvitationWithRegistration,
  InvitationsSearchParams,
  InviteStaffRequest,
  SetOwnerAsDoctorRequest,
  StaffSearchParams,
} from "./types";

// ── Queries ───────────────────────────────────────────────────────────────────

export function useStaffList(params: StaffSearchParams = {}) {
  const {
    role,
    isActive,
    sortBy,
    sortDirection,
    pageNumber = 1,
    pageSize = 10,
  } = params;
  return useQuery({
    queryKey: [
      "staff",
      role,
      isActive,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    ],
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
  const {
    status,
    role,
    sortBy,
    sortDirection,
    pageNumber = 1,
    pageSize = 10,
  } = params;
  return useQuery({
    queryKey: [
      "staff-invitations",
      status,
      role,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    ],
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

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useInviteStaff() {
  return useMutationWithToast<unknown, InviteStaffRequest>({
    mutationFn: (data) => staffApi.inviteStaff(data),
    successMessage: "toast.staffInvitationSent",
    invalidateKeys: [["staff-invitations"]],
  });
}

export function useAcceptInvitationWithRegistration() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      token,
      data,
    }: {
      token: string;
      data: AcceptInvitationWithRegistration;
    }) => staffApi.acceptInvitationWithRegistration(token, data),
    onSuccess: () => {
      showSuccess("toast.invitationAccepted");
      navigate("/login");
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useCancelInvitation() {
  return useMutationWithToast<unknown, string>({
    mutationFn: (id) => staffApi.cancelInvitation(id),
    successMessage: "toast.invitationCancelled",
    invalidateKeys: [["staff-invitations"]],
  });
}

export function useResendInvitation() {
  return useMutationWithToast<unknown, string>({
    mutationFn: (id) => staffApi.resendInvitation(id),
    successMessage: "toast.invitationResent",
    invalidateKeys: [["staff-invitations"]],
  });
}

export function useSetOwnerAsDoctor() {
  return useMutationWithToast<unknown, SetOwnerAsDoctorRequest>({
    mutationFn: (data) => staffApi.setOwnerAsDoctor(data),
    successMessage: "toast.ownerSetAsDoctor",
    invalidateKeys: [["staff"]],
  });
}

export function useSetStaffActiveStatus() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      staffApi.setActiveStatus(id, isActive),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      showSuccess(isActive ? "toast.staffActivated" : "toast.staffDeactivated");
    },
    onError: createErrorHandler(showError, t),
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

export function useSaveWorkingDays(staffId: string, branchId: string) {
  return useMutationWithToast<void, import("./staffApi").WorkingDayInput[]>({
    mutationFn: (days) => staffApi.saveWorkingDays(staffId, branchId, days),
    successMessage: "toast.workingDaysSaved",
    invalidateKeys: [["staff", "working-days", staffId]],
  });
}
