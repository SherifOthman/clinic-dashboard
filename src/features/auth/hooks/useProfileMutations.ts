import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/core/hooks/useToast";
import { profileApi, type UpdateProfileRequest } from "../api/profileApi";
import type { User } from "../types/index";
import { useAuth } from "./useAuth";

/**
 * Profile mutation hooks
 */

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (updatedUser: User) => {
      // Update the user in auth context
      setUser(updatedUser);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      showSuccess("toast.profileUpdatedSuccessfully");
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);

      // Handle validation errors
      if (error?.response?.status === 400 && error?.response?.data?.errors) {
        // For now, show generic error - we can enhance this later
        showError("toast.profileUpdateFailed");
      } else {
        showError("toast.profileUpdateFailed");
      }
    },
  });
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (image: File) => profileApi.updateProfileImage(image),
    onSuccess: (updatedUser: User) => {
      // Update the user in auth context with the full user object
      setUser(updatedUser);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      showSuccess("toast.profileImageUpdatedSuccessfully");
    },
    onError: (error: any) => {
      console.error("Failed to update profile image:", error);
      showError("toast.profileImageUpdateFailed");
    },
  });
}

export function useDeleteProfileImage() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: () => profileApi.deleteProfileImage(),
    onSuccess: (updatedUser: User) => {
      // Update the user in auth context
      setUser(updatedUser);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      showSuccess("toast.profileImageDeletedSuccessfully");
    },
    onError: (error: any) => {
      console.error("Failed to delete profile image:", error);
      showError("toast.profileImageDeleteFailed");
    },
  });
}
