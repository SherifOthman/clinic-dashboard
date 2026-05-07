import type { Permission } from "@/core/constants";
import { useToast } from "@/core/hooks/useToast";
import { createErrorHandler } from "@/core/utils/apiErrorHandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { authApi } from "../api/authApi";
import type { ChangePassword, ConfirmEmail, UpdateProfile } from "../schemas";

/**
 * Auth hooks for the dashboard.
 *
 * Login and Register are handled by the Next.js app.
 * The dashboard only needs to:
 *   - Read the current user via /me (cookie is sent automatically)
 *   - Logout (clears cookies on the backend)
 *   - Manage profile
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

/**
 * For clinic owners who completed onboarding, the JWT issued at login time
 * may not contain the ClinicId claim (e.g. Google OAuth users who onboarded
 * before the token was refreshed). This hook fires a one-time silent refresh
 * on mount so the new token includes ClinicId and RequireClinicOwner passes.
 *
 * NOTE: The backend handles token refresh automatically via the cookie middleware.
 * This hook is intentionally a no-op — kept for reference only.
 */
export function useEnsureClinicOwnerToken(_user: ReturnType<typeof useMe>["user"]) {
  // No-op: backend refreshes the token automatically via HttpOnly cookie middleware.
  // Calling /auth/refresh manually here caused 400 errors when the token was already valid.
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

export function useConfirmEmail() {
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();

  return useMutation({
    mutationFn: (data: ConfirmEmail) => authApi.confirmEmail(data),
    onSuccess: () => {
      showSuccess("toast.emailConfirmedSuccessfully");
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
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
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => showSuccess("toast.passwordResetSuccessful"),
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
