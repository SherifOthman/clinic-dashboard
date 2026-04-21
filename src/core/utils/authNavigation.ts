import type { User } from "@/features/auth/types";
import { isClinicOwner } from "./permissions";

/**
 * Determines the appropriate route for an authenticated user based on their state
 * Single source of truth for authentication-based navigation
 */
export function getAuthenticatedUserRoute(user: User): string {
  if (!user.emailConfirmed) {
    return `/verify-email/${encodeURIComponent(user.email)}`;
  }

  if (canAccessOnboarding(user)) {
    return "/onboarding";
  }

  return "/dashboard";
}

export function canAccessOnboarding(user: User): boolean {
  return isClinicOwner(user) && !user.onboardingCompleted;
}
