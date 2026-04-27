import { Loading } from "@/core/components/ui/Loading";
import { canAccessOnboarding, getAuthenticatedUserRoute } from "@/core/utils/authNavigation";
import { useMe } from "@/features/auth/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AUTH_URL = (import.meta.env.VITE_AUTH_URL as string | undefined)
  ?? "http://localhost:3001/en/login";

export function RequireAuth() {
  const { user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) return <Loading className="h-screen" />;

  // Not authenticated → redirect to Next.js login page
  if (!user) {
    window.location.href = AUTH_URL;
    return <Loading className="h-screen" />;
  }

  const isOnOnboardingPage = location.pathname.startsWith("/onboarding");

  if (isOnOnboardingPage) {
    if (!canAccessOnboarding(user)) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
  }

  const requiredRoute = getAuthenticatedUserRoute(user);
  if (requiredRoute !== "/dashboard") return <Navigate to={requiredRoute} replace />;

  return <Outlet />;
}
