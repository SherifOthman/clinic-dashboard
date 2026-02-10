import { authApi } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboardingApi";

export function useCompleteOnboarding() {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.completeOnboarding,
    onSuccess: async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedUser = await authApi.getMe();
        setUser(updatedUser);
        queryClient.setQueryData(["auth", "me"], updatedUser);
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      } catch {
        // Ignore error, user data will be refreshed on next page load
      }
    },
    throwOnError: false,
  });
}
