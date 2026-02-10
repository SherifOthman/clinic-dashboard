import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

/**
 * Auth query hooks
 * Provides all authentication-related queries
 */

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getMe(),
    retry: false,
  });
}
