import { Loading } from "@/core/components/Loading";
import { isClinicOwner } from "@/core/utils/roleUtils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function RequireAuth() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.emailConfirmed) {
    return (
      <Navigate
        to={`/verify-email/${encodeURIComponent(user.email)}`}
        replace
      />
    );
  }

  const userIsClinicOwner = isClinicOwner(user);
  const isOnOnboardingPage = location.pathname.startsWith("/onboarding");

  if (userIsClinicOwner && !user.onboardingCompleted && !isOnOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!userIsClinicOwner && isOnOnboardingPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
