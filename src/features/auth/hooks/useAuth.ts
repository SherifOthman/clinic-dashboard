import type { Permission } from "@/core/constants";
import { getErrorMessage } from "@/core/utils/apiErrorHandler";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  changePassword,
  deleteProfileImage,
  getMe,
  logout,
  updateProfile,
  updateProfileImage,
} from "../api/authApi";
import type { ChangePassword, UpdateProfile } from "../schemas";

export function useMe() {
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    user: query.data,
    isAuthenticated: !!query.data,
    hasPermission: (permission: Permission): boolean =>
      query.data?.permissions?.includes(permission) ?? false,
    hasAnyPermission: (...permissions: Permission[]): boolean =>
      permissions.some((p) => query.data?.permissions?.includes(p) ?? false),
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const authUrl = import.meta.env.VITE_AUTH_URL ?? "https://clinic-website-lime.vercel.app/en/login";

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = authUrl;
    },
  });
}

export function useChangePassword() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: ChangePassword) => changePassword(data),
    onSuccess: () => toast.success(t("toast.passwordChangedSuccessfully")),
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateProfile) =>
      updateProfile({ ...data, phoneNumber: data.phoneNumber || undefined }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}

export function useDeleteProfileImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}
