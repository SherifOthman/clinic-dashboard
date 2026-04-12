import { Loading } from "@/core/components/ui/Loading";
import {
  canAccessOnboarding,
  getAuthenticatedUserRoute,
} from "@/core/utils/authNavigation";
import { useMe } from "@/features/auth/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function RequireAuth() {
  const { user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) {
    return <Loading className="h-screen" />;
  }

  // Not logged in → redirect to login, preserving the intended destination
  // so after login the user lands back where they were trying to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isOnOnboardingPage = location.pathname.startsWith("/onboarding");

  if (isOnOnboardingPage) {
    // Only ClinicOwners who haven't completed onboarding can access /onboarding
    if (!canAccessOnboarding(user)) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  }

  // getAuthenticatedUserRoute returns "/dashboard" for normal users,
  // or "/onboarding" / "/verify-email/..." for users who need to complete a step.
  // If the required route isn't /dashboard, redirect there first.
  const requiredRoute = getAuthenticatedUserRoute(user);
  if (requiredRoute !== "/dashboard") {
    return <Navigate to={requiredRoute} replace />;
  }

  return <Outlet />;
}
