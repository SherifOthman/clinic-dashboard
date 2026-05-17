import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { getErrorMessage } from "@/core/utils/apiErrorHandler";
import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  acceptInvitationWithRegistration,
  cancelInvitation,
  createVisitType,
  inviteStaff,
  removeVisitType,
  resendInvitation,
  saveWorkingDays,
  setOwnerAsDoctor,
  setPermissions,
  setScheduleLock,
  setStaffActiveStatus,
  updateVisitType,
  type UpsertDoctorVisitTypeRequest,
  type WorkingDayInput,
} from "./staffApi";
import type {
  AcceptInvitationWithRegistration,
  InviteStaffRequest,
  SetOwnerAsDoctorRequest,
} from "./types";

export function useInviteStaff() {
  return useMutationWithToast<unknown, InviteStaffRequest>({
    mutationFn: inviteStaff,
    successMessage: "toast.staffInvitationSent",
    invalidateKeys: [["staff-invitations"]],
  });
}

export function useAcceptInvitationWithRegistration() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: AcceptInvitationWithRegistration }) =>
      acceptInvitationWithRegistration(token, data),
    onSuccess: () => {
      toast.success(t("toast.invitationAccepted"));
      navigate("/login");
    },
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}

export function useCancelInvitation() {
  return useMutationWithToast<unknown, string>({
    mutationFn: cancelInvitation,
    invalidateKeys: [["staff-invitations"]],
  });
}

export function useResendInvitation() {
  return useMutationWithToast<unknown, string>({
    mutationFn: resendInvitation,
    successMessage: "toast.invitationResent",
    invalidateKeys: [["staff-invitations"]],
  });
}

export function useSetOwnerAsDoctor() {
  return useMutationWithToast<unknown, SetOwnerAsDoctorRequest>({
    mutationFn: setOwnerAsDoctor,
    invalidateKeys: [["staff"]],
  });
}

export function useSetStaffActiveStatus() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setStaffActiveStatus(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}

export function useSaveWorkingDays(staffId: string, branchId: string) {
  return useMutationWithToast<void, WorkingDayInput[]>({
    mutationFn: (days) => saveWorkingDays(staffId, branchId, days),
    successMessage: "toast.workingDaysSaved",
    invalidateKeys: [["staff", "working-days", staffId]],
  });
}

export function useCreateVisitType(staffId: string) {
  return useMutationWithToast<string, UpsertDoctorVisitTypeRequest>({
    mutationFn: (data) => createVisitType(staffId, data),
    invalidateKeys: [["staff", "visit-types", staffId]],
  });
}

export function useUpdateVisitType(staffId: string) {
  return useMutationWithToast<void, { visitTypeId: string; data: UpsertDoctorVisitTypeRequest }>({
    mutationFn: ({ visitTypeId, data }) => updateVisitType(staffId, visitTypeId, data),
    invalidateKeys: [["staff", "visit-types", staffId]],
  });
}

export function useRemoveVisitType(staffId: string) {
  return useMutationWithToast<void, string>({
    mutationFn: (visitTypeId) => removeVisitType(staffId, visitTypeId),
    invalidateKeys: [["staff", "visit-types", staffId]],
  });
}

export function useSetScheduleLock() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ staffId, canSelfManage }: { staffId: string; canSelfManage: boolean }) =>
      setScheduleLock(staffId, canSelfManage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}

export function useSetPermissions(staffId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (permissions: string[]) => setPermissions(staffId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "permissions", staffId] });
      toast.success(t("toast.permissionsUpdated"));
    },
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}
