import type { Permission } from "@/core/constants";
import { useToast } from "@/core/hooks/useToast";
import { createErrorHandler } from "@/core/utils/apiErrorHandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { authApi } from "../api/authApi";
import type { ChangePassword, UpdateProfile } from "../schemas";

/**
 * Auth hooks for the dashboard.
 *
 * Login, Register, ForgotPassword, ResetPassword, EmailVerification
 * are all handled by the Next.js website.
 *
 * The dashboard only needs to:
 *   - Read the current user via /me (cookie sent automatically)
 *   - Logout (clears cookies on the backend)
 *   - Change password and manage profile
 */

// ── Queries ───────────────────────────────────────────────────────────────────

export function useMe() {
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
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

// ── Auth mutations ────────────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();
  const authUrl = import.meta.env.VITE_AUTH_URL ?? "https://clinic-website-lime.vercel.app/en/login";

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = authUrl;
    },
  });
}

export function useChangePassword() {
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: ChangePassword) => authApi.changePassword(data),
    onSuccess: () => showSuccess("toast.passwordChangedSuccessfully"),
    onError: createErrorHandler(showError, t),
  });
}

// ── Profile mutations ─────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateProfile) =>
      authApi.updateProfile({ ...data, phoneNumber: data.phoneNumber || undefined }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      showSuccess("toast.profileUpdatedSuccessfully");
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.updateProfileImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      showSuccess("toast.profileImageUpdatedSuccessfully");
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useDeleteProfileImage() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.deleteProfileImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      showSuccess("toast.profileImageDeletedSuccessfully");
    },
    onError: createErrorHandler(showError, t),
  });
}

