import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

/**
 * Real-time availability checks for email and username during registration.
 *
 * staleTime: 0 and gcTime: 0 ensure we always get a fresh result —
 * we don't want a cached "available" response after another user just took the name.
 * retry: false avoids hammering the server on network errors.
 *
 * These are used with useDebouncedValidation so the API is only called
 * after the user stops typing for 500ms.
 */
export function useEmailValidation(email: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ["validation", "email", email],
    queryFn: () => authApi.checkEmailAvailability(email),
    enabled: enabled && !!email,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}

export function useUsernameValidation(
  username: string,
  enabled: boolean = false,
) {
  return useQuery({
    queryKey: ["validation", "username", username],
    queryFn: () => authApi.checkUsernameAvailability(username),
    enabled: enabled && !!username,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}
