import { tokenManager } from "@/core/api";
import type { Permission } from "@/core/constants";
import { useToast } from "@/core/hooks/useToast";
import { createErrorHandler } from "@/core/utils/apiErrorHandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { authApi } from "../api/authApi";
import type { ChangePassword, ConfirmEmail, UpdateProfile } from "../schemas";

/**
 * Unified auth hooks — queries and mutations for authentication and profile.
 *
 * useMe is the central auth state hook. It's called in RequireAuth, RequireGuest,
 * Sidebar, UserAvatar, and any component that needs to know who is logged in.
 * gcTime: Infinity keeps the user data in cache even when no component is
 * subscribed, so navigating away and back doesn't trigger a refetch.
 */

// ── Queries ───────────────────────────────────────────────────────────────────

export function useMe() {
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    retry: false, // Don't retry on 401 — user is simply not logged in
    staleTime: 5 * 60 * 1000,
    gcTime: Infinity, // Keep in cache forever — cleared on logout
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    user: query.data,
    isAuthenticated: !!query.data,
    /** Check if the current user has a specific permission */
    hasPermission: (permission: Permission): boolean =>
      query.data?.permissions?.includes(permission) ?? false,
    /** Check if the current user has any of the given permissions */
    hasAnyPermission: (...permissions: Permission[]): boolean =>
      permissions.some((p) => query.data?.permissions?.includes(p) ?? false),
  };
}

// ── Auth mutations ────────────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (loginResponse) => {
      try {
        tokenManager.setAccessToken(loginResponse.accessToken);
        const userData = await authApi.getMe();
        queryClient.setQueryData(["auth", "me"], userData);
        navigate("/dashboard");
      } catch {
        showError("toast.loginFailedUserData");
      }
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (_, variables) => {
      showSuccess("toast.registrationSuccessful");
      navigate(`/verify-email/${encodeURIComponent(variables.email)}`);
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useConfirmEmail() {
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();

  return useMutation({
    mutationFn: (data: ConfirmEmail) => authApi.confirmEmail(data),
    onSuccess: () => {
      showSuccess("toast.emailConfirmedSuccessfully");

      authApi
        .getMe()
        .then((userData) => {
          queryClient.setQueryData(["auth", "me"], userData);
        })
        .catch(() => {
          tokenManager.clearTokens();
          queryClient.setQueryData(["auth", "me"], null);
        });
    },
  });
}

export function useForgotPassword() {
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => showSuccess("toast.passwordResetEmailSent"),
    onError: createErrorHandler(showError, t),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      showSuccess("toast.passwordResetSuccessful");
      navigate("/password-changed");
    },
    onError: createErrorHandler(showError, t),
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

export function useResendEmailVerification() {
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.resendEmailVerification,
    onSuccess: () => showSuccess("toast.emailConfirmedSuccessfully"),
    onError: createErrorHandler(showError, t),
  });
}

// ── Profile mutations ─────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateProfile) => {
      // Convert empty string to undefined for optional phone number
      const payload = {
        ...data,
        phoneNumber: data.phoneNumber || undefined,
      };
      return authApi.updateProfile(payload);
    },
    onSuccess: async () => {
      // Refetch user data to get updated profile
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
      // Refetch user data to get updated profile image
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
      // Refetch user data to get updated profile
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      showSuccess("toast.profileImageDeletedSuccessfully");
    },
    onError: createErrorHandler(showError, t),
  });
}
