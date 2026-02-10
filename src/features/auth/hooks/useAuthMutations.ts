import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/core/hooks/useToast";
import { isClinicOwner } from "@/core/utils/roleUtils";
import { authApi } from "../api/authApi";
import type {
  ChangePasswordDto,
  ConfirmEmailDto,
  LoginDto,
} from "../types/index";
import { useAuth } from "./useAuth";

/**
 * Auth mutation hooks
 * Provides all authentication-related mutations
 */

export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: async () => {
      try {
        // Get user data after successful login
        const userData = await authApi.getMe();
        setUser(userData);
        queryClient.setQueryData(["auth", "me"], userData);
        showSuccess("toast.loginSuccessful");

        // Navigate based on user state
        const userIsClinicOwner = isClinicOwner(userData);

        if (userIsClinicOwner && !userData.onboardingCompleted) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      } catch {
        showError("toast.loginFailedUserData");
      }
    },
    onError: (error: any, variables) => {
      // Extract error code
      const errorCode = error?.response?.data?.code;

      // Handle email not confirmed error
      if (errorCode === "AUTH.EMAIL.NOT_CONFIRMED") {
        navigate(`/verify-email/${encodeURIComponent(variables.email)}`);
        showError(t("serverErrors.AUTH.EMAIL.NOT_CONFIRMED"));
        return;
      }

      // Show translated error message
      if (errorCode) {
        const translationKey = `serverErrors.${errorCode}`;
        const translatedMessage = t(translationKey);
        // If translation exists, show it in toast
        if (translatedMessage !== translationKey) {
          showError(translatedMessage);
        }
      }
      // Let the form handle error display through setServerErrors
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (_, variables) => {
      showSuccess("toast.registrationSuccessful");
      navigate(`/verify-email/${encodeURIComponent(variables.email)}`);
    },
    onError: () => showError("toast.registrationFailed"),
  });
}

export function useConfirmEmail() {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: ConfirmEmailDto) => authApi.confirmEmail(data),
    onSuccess: () => showSuccess("toast.emailConfirmedSuccessfully"),
    onError: () => showError("toast.emailConfirmationFailed"),
  });
}

export function useForgotPassword() {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => showSuccess("toast.passwordResetEmailSent"),
    onError: () => showError("toast.passwordResetEmailFailed"),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      showSuccess("toast.passwordResetSuccessful");
      navigate("/password-changed");
    },
    onError: (error: any) => {
      console.error("Password reset failed:", error);
    },
  });
}

export function useChangePassword() {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: ChangePasswordDto) => authApi.changePassword(data),
    onSuccess: () => showSuccess("toast.passwordChangedSuccessfully"),
    onError: () => showError("toast.passwordChangeFailed"),
  });
}

export function useResendEmailVerification() {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: authApi.resendEmailVerification,
    onSuccess: () => showSuccess("toast.emailConfirmedSuccessfully"),
    onError: () => showError("toast.emailConfirmationFailed"),
  });
}
