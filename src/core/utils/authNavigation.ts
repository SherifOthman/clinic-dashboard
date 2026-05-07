import type { User } from "@/features/auth/types";
import { isClinicOwner } from "./permissions";

/**
 * Determines the appropriate route for an authenticated user.
 * Email verification is handled by the website — not the dashboard.
 */
export function getAuthenticatedUserRoute(user: User): string {
  if (canAccessOnboarding(user)) return "/onboarding";
  return "/dashboard";
}

export function canAccessOnboarding(user: User): boolean {
  return isClinicOwner(user) && !user.onboardingCompleted;
}
