import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useToast } from "@/core/hooks/useToast";
import { createErrorHandler } from "@/core/utils/apiErrorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { staffApi } from "./staffApi";
import type {
  AcceptInvitationWithRegistration,
  InviteStaffRequest,
  SetOwnerAsDoctorRequest,
} from "./types";

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
    mutationFn: ({ token, data }: { token: string; data: AcceptInvitationWithRegistration }) =>
      staffApi.acceptInvitationWithRegistration(token, data),
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

export function useSaveWorkingDays(staffId: string, branchId: string) {
  return useMutationWithToast<void, import("./staffApi").WorkingDayInput[]>({
    mutationFn: (days) => staffApi.saveWorkingDays(staffId, branchId, days),
    successMessage: "toast.workingDaysSaved",
    invalidateKeys: [["staff", "working-days", staffId]],
  });
}

export function useUpsertVisitType(staffId: string) {
  return useMutationWithToast<string, import("./staffApi").UpsertDoctorVisitTypeRequest>({
    mutationFn: (data) => staffApi.upsertVisitType(staffId, data),
    successMessage: "toast.visitTypeSaved",
    invalidateKeys: [["staff", "visit-types", staffId]],
  });
}

export function useRemoveVisitType(staffId: string) {
  return useMutationWithToast<void, string>({
    mutationFn: (visitTypeId) => staffApi.removeVisitType(staffId, visitTypeId),
    successMessage: "toast.visitTypeRemoved",
    invalidateKeys: [["staff", "visit-types", staffId]],
  });
}

export function useSetScheduleLock() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ staffId, canSelfManage }: { staffId: string; canSelfManage: boolean }) =>
      staffApi.setScheduleLock(staffId, canSelfManage),
    onSuccess: (_, { canSelfManage }) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      showSuccess(canSelfManage ? "toast.scheduleUnlocked" : "toast.scheduleLocked");
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useSetPermissions(staffId: string) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (permissions: string[]) => staffApi.setPermissions(staffId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "permissions", staffId] });
      showSuccess("toast.permissionsUpdated");
    },
    onError: createErrorHandler(showError, t),
  });
}
